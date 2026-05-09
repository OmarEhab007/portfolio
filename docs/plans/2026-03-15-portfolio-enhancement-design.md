# Portfolio Enhancement Design

**Date:** 2026-03-15
**Author:** Omar Ehab + Claude
**Status:** Approved

## Overview

Enhance the omar.dev portfolio with new project content, technical blog articles, updated skills, and a full UI/UX polish pass while preserving the retro/neocities aesthetic.

## Approach

Content-First, Then UI (Approach B) — two clear phases to keep content changes safe and reviewable before visual work.

---

## Phase 1 — Content Updates

### 1.1 Projects Section

Add RemedyIQ and bmc-remedy-rag-agent as the **top two projects** in the existing list, pushing current projects down.

**RemedyIQ (New #1):**
- Description: Enterprise log intelligence platform for BMC Remedy AR Server. Go + Next.js 16, ClickHouse, NATS JetStream, AI-powered analysis with Gemini & Anthropic.
- Link: https://github.com/OmarEhab007/RemedyIQ
- Tech: Go 1.24, Next.js 16, React 19, PostgreSQL, ClickHouse, NATS, Redis, MinIO, Bleve, Gemini API, Anthropic SDK

**BMC Remedy RAG Agent (New #2):**
- Description: On-premise RAG agent for BMC Remedy ITSM. Java 17 + Spring Boot 3.2, LangChain4j, pgvector, local embeddings. 100% air-gapped, zero cloud dependencies.
- Link: https://github.com/OmarEhab007/bmc-remedy-rag-agent
- Tech: Java 17, Spring Boot 3.2, LangChain4j 0.35, PostgreSQL 16, pgvector, Ollama, React 19, ONNX embeddings

### 1.2 Blog Posts

Two new technical deep-dive articles, prepended to the blog list:

1. **"Building RemedyIQ: Enterprise Log Intelligence with Go & AI"**
   - Architecture: 3-service microservice design (Frontend, API, Worker)
   - Tech choices: Why ClickHouse for logs, why NATS over Kafka, why Go
   - AI analysis modes: performance, root_cause, error_explainer, anomaly_narrator, summarizer, nl_query
   - Streaming SSE implementation for AI responses
   - KQL-based search engine with autocomplete
   - Transaction tracing with waterfall visualization

2. **"Building an Air-Gapped RAG Agent for BMC Remedy"**
   - RAG architecture: chunking, embedding, retrieval, generation pipeline
   - LangChain4j integration with Spring Boot
   - pgvector + hybrid search (vector + full-text via RRF)
   - ONNX local embeddings (all-minilm-l6-v2, 384 dimensions)
   - ReBAC security model for multi-tenant data isolation
   - Agentic operations: incident creation with confirmation workflow
   - Bilingual support (English + Arabic RTL)

### 1.3 Skills Section Update

Merge new skills into existing 4 groups:

- **Backend & Languages:** Add `LangChain4j`, `React`
- **Databases & Messaging:** Add `ClickHouse`, `pgvector`, `NATS JetStream`, `MinIO`
- **BMC Remedy:** Add `AR Log Analysis`, `ITSM Automation`

---

## Phase 2 — UI/UX Polish

### 2.1 Page Load — Staggered Entrance Animations
- Each `.box` fades in + slides up with incremental delay (50ms per box)
- CSS `@keyframes fadeSlideUp` + JS `IntersectionObserver` for scroll-triggered reveals
- Skeleton shimmer on initial load

### 2.2 Hover Micro-Interactions
- Project links: smooth underline slide-in from left + subtle glow
- Skill tags: scale(1.05) + accent border glow on hover
- Nav links: arrow slide-in animation
- Blog entries: background highlight sweep
- All transitions: `cubic-bezier(0.4, 0, 0.2, 1)` easing

### 2.3 Background Canvas Polish
- Stars: subtle parallax on mouse move
- Rain: variable speed/thickness drops, subtle splash at bottom
- Throttle to 30fps for performance

### 2.4 Custom Branded 88x31 Buttons
Replace generic buttons with omar.dev branded CSS-only buttons:
- `OMAR.DEV` — primary brand, cyan glow
- `RemedyIQ` — green accent
- `RAG Agent` — yellow accent
- `Go + Java` — tech stack
- `Dark Mode` — aesthetic with moon icon

Retro pixel-font styling, hover glow effects, no images needed.

### 2.5 Banner Section Polish
- Replace floating/gliding with smoother CSS transforms
- Subtle `perspective` 3D tilt on hover
- Staggered entrance animations

### 2.6 General Polish
- Custom scrollbar styling
- Better focus states for accessibility
- Subtle box-shadow depth on `.box` hover
- Footer year: 2024-2026

---

## Files to Modify

| File | Changes |
|------|---------|
| `index.html` | Projects section (add 2), Skills section (add tags), Blog section (add 2 entries), Buttons section (replace), Footer year |
| `assets/css/style.css` | Entrance animations, hover effects, button styles, scrollbar, focus states, banner polish |
| `assets/js/script.js` | IntersectionObserver for scroll reveals, parallax on mouse move, canvas improvements |
| `blogs/index.json` | Add 2 new blog entries |
| `blogs/building-remedyiq.md` | New blog post |
| `blogs/building-rag-agent.md` | New blog post |

## Decision Log

- Keep retro aesthetic, polish only — no redesign
- Projects: RemedyIQ and RAG Agent at top of list
- Blog tone: Technical deep-dive targeting fellow engineers
- Skills: Merge into existing 4 groups (no new group)
- Buttons: Custom branded CSS-only, replace generics
- UI approach: Content first, then visual polish
