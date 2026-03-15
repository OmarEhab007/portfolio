# Building RemedyIQ: A Technical Deep-Dive into Enterprise Log Intelligence

*March 15, 2026*

---

## Introduction

AR Server logs are dense, massive, and cryptic. Anyone who has administered BMC Remedy knows the pain: a production issue hits, you pull the logs, and you're staring at thousands of lines of thread traces, filter executions, and SQL timings with no easy way to make sense of it all.

I built RemedyIQ to fix that. It's an enterprise log intelligence platform purpose-built for BMC Remedy AR Server — it ingests raw log files, parses and indexes every entry, and gives you dashboards, full-text search, transaction tracing, and AI-assisted analysis. This post walks through the architecture, the key technical decisions, and the lessons I learned building it.

## Architecture: Three Services, Clear Boundaries

RemedyIQ is a 3-service microservice system. I deliberately kept the service count low — enough to separate concerns, but not so many that operational overhead becomes a project in itself.

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Frontend        │────▶│  API Service      │────▶│  Worker Service  │
│  Next.js 16      │◀────│  Go + gorilla/mux │     │  Go + NATS       │
│  React 19        │ SSE │  Port 8080        │     │  Background Jobs │
│  Port 3000       │     └────────┬─────────┘     └────────┬─────────┘
└──────────────────┘              │                         │
                                  │                         │
                    ┌─────────────┼─────────────────────────┼──────────┐
                    │             ▼                         ▼          │
                    │  ┌──────────────┐  ┌────────────┐  ┌─────────┐  │
                    │  │  PostgreSQL  │  │ ClickHouse │  │  MinIO  │  │
                    │  │  (metadata)  │  │ (events)   │  │ (files) │  │
                    │  └──────────────┘  └────────────┘  └─────────┘  │
                    │  ┌──────────────┐  ┌────────────┐               │
                    │  │    Redis     │  │   NATS     │               │
                    │  │  (cache)     │  │ JetStream  │               │
                    │  └──────────────┘  └────────────┘               │
                    └─────────────────────────────────────────────────┘
```

1. **Frontend Service** — Next.js 16 with React 19, TypeScript, Tailwind CSS, and Recharts for data visualization. Handles the multi-section analysis dashboard, KQL search interface, and transaction tracing waterfall views.

2. **API Service** — A Go REST API using gorilla/mux. Serves dashboard data, handles file uploads, manages AI conversations, and streams AI responses via Server-Sent Events. This is the coordination layer.

3. **Worker Service** — A Go background processor that subscribes to NATS JetStream. It picks up analysis jobs, runs the ARLogAnalyzer JAR against uploaded log files, and writes parsed events into ClickHouse.

## Why Go for the Backend

I chose Go for both the API and Worker services, and it paid off in several ways.

**Concurrency is first-class.** The Worker service processes log files that can be hundreds of megabytes. Go's goroutines made it straightforward to parallelize parsing stages without the overhead of OS threads. The API service handles concurrent SSE streams, WebSocket connections, and REST requests — Go's scheduler manages all of this cleanly.

**Deployment simplicity.** Each service compiles to a single static binary. No runtime dependencies, no JVM tuning, no node_modules. The Docker images are tiny.

**Fast cold starts.** The Worker service scales based on job queue depth. Go services start in milliseconds, which matters when you're spinning up workers to handle a burst of uploaded log files.

Here's a simplified look at how the API service sets up routes:

```go
func NewRouter(cfg *config.Config, deps *Dependencies) *mux.Router {
    r := mux.NewRouter()
    r.Use(middleware.CORS, middleware.RequestID, middleware.Logger)

    api := r.PathPrefix("/api/v1").Subrouter()

    // File upload & analysis jobs
    api.HandleFunc("/files/upload", deps.FileHandler.Upload).Methods("POST")
    api.HandleFunc("/jobs/{id}", deps.JobHandler.GetStatus).Methods("GET")
    api.HandleFunc("/jobs/{id}/stream", deps.JobHandler.StreamProgress).Methods("GET")

    // Dashboard & search
    api.HandleFunc("/analyses/{id}/dashboard", deps.DashboardHandler.Get).Methods("GET")
    api.HandleFunc("/search", deps.SearchHandler.Query).Methods("POST")
    api.HandleFunc("/search/saved", deps.SearchHandler.ListSaved).Methods("GET")

    // AI conversations
    api.HandleFunc("/ai/conversations", deps.AIHandler.Create).Methods("POST")
    api.HandleFunc("/ai/conversations/{id}/messages", deps.AIHandler.SendMessage).Methods("POST")
    api.HandleFunc("/ai/conversations/{id}/stream", deps.AIHandler.StreamResponse).Methods("GET")

    return r
}
```

## The Data Layer: ClickHouse for Log Events, PostgreSQL for Everything Else

This was one of the most impactful architectural decisions. Log events — the parsed output of AR Server logs — are write-heavy, append-only, and queried with analytical patterns (aggregations, time-range filters, group-bys). That's exactly what ClickHouse is built for.

```sql
-- ClickHouse: Querying log events by time range and severity
SELECT
    toStartOfMinute(timestamp) AS minute,
    level,
    count() AS event_count
FROM log_events
WHERE analysis_id = {analysis_id:UUID}
  AND timestamp BETWEEN {start:DateTime64} AND {end:DateTime64}
GROUP BY minute, level
ORDER BY minute ASC;
```

That query runs over millions of rows in tens of milliseconds. Doing the same in PostgreSQL would require careful indexing and would still be an order of magnitude slower at scale.

PostgreSQL handles everything else: user accounts, analysis metadata, saved searches, AI conversation history. It's the right tool for relational data with complex access patterns.

**Bleve v2** provides full-text search indexing. I considered Elasticsearch, but Bleve runs as an embedded library — no separate cluster to manage. For a platform where each analysis is a self-contained dataset, embedding the search index keeps things simple.

**Redis** handles caching for dashboard queries and session data. **MinIO** stores the uploaded log files and generated exports (CSV, JSON).

## AI Analysis: Six Modes, Skill-Based Routing

RemedyIQ integrates both Google Gemini and Anthropic's Claude for AI-assisted log analysis. There are six analysis modes:

- **performance** — Identify bottlenecks, slow operations, resource contention
- **root_cause** — Trace errors back to their origin across thread boundaries
- **error_explainer** — Explain cryptic AR Server exceptions in plain English
- **anomaly_narrator** — Detect unusual patterns in log timing and frequency
- **summarizer** — Condense hours of log activity into key takeaways
- **nl_query** — Natural language to KQL query translation

Each mode has a skill-based routing system. When a user sends a message, the API classifies the intent, selects the appropriate analysis mode, builds a context-aware prompt with relevant log data, and routes to the best model.

Responses stream back to the frontend via SSE. Here's the core of the streaming handler:

```go
func (h *AIHandler) StreamResponse(w http.ResponseWriter, r *http.Request) {
    flusher, ok := w.(http.Flusher)
    if !ok {
        http.Error(w, "streaming not supported", http.StatusInternalServerError)
        return
    }

    w.Header().Set("Content-Type", "text/event-stream")
    w.Header().Set("Cache-Control", "no-cache")
    w.Header().Set("Connection", "keep-alive")

    convID := mux.Vars(r)["id"]
    ctx := r.Context()

    stream, err := h.aiService.StreamAnalysis(ctx, convID)
    if err != nil {
        writeSSEError(w, flusher, err)
        return
    }

    for {
        select {
        case <-ctx.Done():
            return
        case chunk, ok := <-stream:
            if !ok {
                fmt.Fprintf(w, "event: done\ndata: {}\n\n")
                flusher.Flush()
                return
            }
            data, _ := json.Marshal(chunk)
            fmt.Fprintf(w, "event: chunk\ndata: %s\n\n", data)
            flusher.Flush()
        }
    }
}
```

SSE was the right choice over WebSockets here. The communication is unidirectional — the server streams tokens to the client. SSE gives us automatic reconnection, works through HTTP/2 multiplexing, and is simpler to implement and debug than a full WebSocket lifecycle.

## NATS JetStream: The Job Queue

When a user uploads a log file, the API doesn't process it synchronously. It stores the file in MinIO, creates a job record in PostgreSQL, and publishes a message to a NATS JetStream subject.

```go
func (s *JobService) Enqueue(ctx context.Context, job *model.Job) error {
    payload, err := json.Marshal(job)
    if err != nil {
        return fmt.Errorf("marshal job: %w", err)
    }

    _, err = s.js.Publish(ctx, "jobs.analysis", payload,
        jetstream.WithMsgID(job.ID.String()),
    )
    return err
}
```

The Worker service subscribes to this subject with a durable consumer. JetStream guarantees at-least-once delivery — if a worker crashes mid-processing, the message gets redelivered to another worker. The idempotency key (`MsgID`) prevents duplicate processing.

I chose NATS over RabbitMQ or Redis Streams for a few reasons: it's a single binary, it has built-in persistence with JetStream, and the Go client is excellent. For this workload — moderate throughput, reliability matters more than raw speed — it's been rock solid.

## KQL Search with Autocomplete

The search interface uses KQL (Kusto Query Language) syntax. Users who work with Azure Data Explorer or Sentinel already know it. For everyone else, there's autocomplete.

The search pipeline works like this:

1. User types a query in the frontend search bar
2. As they type, the frontend sends partial queries to the autocomplete endpoint
3. The API parses the KQL fragment, identifies the current token context (field name, operator, value), and returns suggestions from the Bleve index
4. On submit, the full KQL query is parsed into an AST, validated, and translated to a ClickHouse SQL query
5. Results come back with highlighting and faceted counts

The KQL-to-SQL translation was the trickiest part. KQL has operators like `has`, `contains`, `between`, and `in~` (case-insensitive in) that don't map one-to-one to SQL. I wrote a recursive descent parser that produces an intermediate representation, then a separate SQL emitter that handles the ClickHouse-specific syntax.

## Lessons Learned

**ClickHouse is incredible for log analytics, but schema design matters.** I spent time getting the sort key and partitioning right. Partitioning by `analysis_id` and ordering by `(analysis_id, timestamp)` means queries scoped to a single analysis hit a single partition and scan in order. Getting this wrong early would have been painful to fix with production data.

**SSE is underrated.** For streaming AI responses, SSE was simpler and more reliable than WebSockets. The browser handles reconnection automatically, and there's no connection upgrade dance. I only used WebSockets for the job progress tracker where bidirectional communication was genuinely needed.

**Embedded search (Bleve) has trade-offs.** It's wonderful for simplicity — no cluster, no networking, no version mismatches. But it means the search index lives on the same machine as the API. For RemedyIQ's use case (each analysis is bounded, not internet-scale), this is fine. For a multi-tenant SaaS product, I'd reach for a dedicated search cluster.

**NATS JetStream is a hidden gem.** Coming from RabbitMQ and Kafka, NATS felt refreshingly simple. The operational overhead is nearly zero. JetStream's persistence model is straightforward. The only downside is the smaller ecosystem — fewer monitoring tools, fewer blog posts when something goes wrong.

**Go's error handling verbosity is a feature, not a bug.** At 3 AM debugging a log parsing failure, I was grateful that every error path was explicit and wrapped with context. `fmt.Errorf("parse log entry at line %d: %w", lineNum, err)` tells you exactly where things went wrong.

## What's Next

I'm working on adding correlation analysis — automatically linking related log entries across AR Server threads to reconstruct full transaction flows. The waterfall visualization already shows individual transactions; the next step is connecting them across services and time windows.

RemedyIQ started as a tool to solve my own frustration with AR Server log analysis. It's grown into something I'd have killed for in my early Remedy days.

*Build the tools you wish you had.* ☾

---

**Tags:** `#Go` `#ClickHouse` `#microservices` `#AI` `#log-analysis` `#NATS` `#BMCRemedy` `#architecture`
