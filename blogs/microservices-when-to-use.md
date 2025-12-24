# Microservices: When to Use (and When Not)

*December 14, 2025*

---

## The Microservices Hype

Every tech conference, every blog, every architect: "Use microservices!" But here's the thing – **microservices aren't always the answer**. Sometimes they're the problem.

## What Are Microservices?

At their core, microservices are about decomposing your application into small, independent services that:

- **Own their data** - Each service has its database
- **Communicate via APIs** - Usually REST or messaging
- **Deploy independently** - No coordinated releases
- **Scale independently** - Scale what needs scaling

```
┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │────▶│   API   │────▶│  Auth   │
│ Service │     │ Gateway │     │ Service │
└─────────┘     └─────────┘     └─────────┘
     │                               │
     ▼                               ▼
┌─────────┐                    ┌─────────┐
│  User   │                    │  Auth   │
│   DB    │                    │   DB    │
└─────────┘                    └─────────┘
```

## When TO Use Microservices

### 1. Large Teams
If you have multiple teams working on the same codebase and stepping on each other's toes, microservices create clear boundaries.

```
Team A → User Service
Team B → Payment Service  
Team C → Inventory Service
```

### 2. Scaling Requirements Vary
When different parts of your system have different scaling needs:

```yaml
# User service: Low traffic, simple CRUD
replicas: 2

# Search service: High traffic, compute-intensive
replicas: 20
```

### 3. Technology Diversity
Need Python for ML, Go for performance, Node for real-time?

```
┌─────────────────────────────────────────┐
│         Your System                      │
├───────────┬───────────┬─────────────────┤
│ ML Service│ Core API  │ Real-time       │
│ (Python)  │ (Go)      │ (Node.js)       │
└───────────┴───────────┴─────────────────┘
```

### 4. Fault Isolation
A bug in the notification service shouldn't bring down payments.

### 5. You're at Scale
If you're handling millions of requests and have the team to support it.

## When NOT to Use Microservices

### 1. Small Teams
3 developers maintaining 15 microservices = burnout

```
Reality Check:
├── 1 developer per service? ❌
├── Who handles on-call? 😱
├── Who maintains all the infra? 🤷
└── Debugging distributed traces? 🔥
```

### 2. New Projects / MVPs
You don't know your domain well enough to draw service boundaries.

```
Startup Journey:
Day 1:   "Let's build microservices!"
Month 3: "Why is deployment so complex?"
Month 6: "We need to merge these services..."
Year 1:  "Should've started with a monolith"
```

### 3. Tight Coupling Between Services
If services constantly need each other's data, you've just built a distributed monolith.

### 4. Limited DevOps Capability
Microservices require:
- Container orchestration (K8s)
- Service discovery
- Distributed tracing
- Log aggregation
- CI/CD pipelines per service

### 5. Simple Domains
A blog doesn't need microservices. A todo app doesn't need microservices.

## The Monolith First Approach

```
Start Here:
┌─────────────────────────────────────┐
│         Modular Monolith            │
├─────────────────────────────────────┤
│  ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐  │
│  │User │ │Order│ │ Pay │ │ Ship│  │
│  └─────┘ └─────┘ └─────┘ └─────┘  │
│           Single Deployment         │
└─────────────────────────────────────┘
           ↓ When needed ↓
┌─────────┐  ┌─────────┐  ┌─────────┐
│  User   │  │  Order  │  │ Payment │
│ Service │  │ Service │  │ Service │
└─────────┘  └─────────┘  └─────────┘
```

Build a well-structured monolith. Extract services when you have clear reasons.

## The Hidden Costs

Things nobody tells you about microservices:

```java
// Simple monolith call
Order order = orderService.createOrder(cart);

// Microservices equivalent
try {
    // Network call
    OrderResponse response = orderClient.createOrder(cart);
    // Handle timeout
    // Handle retry
    // Handle circuit breaker
    // Handle distributed transaction rollback
    // Handle eventual consistency
    // Wonder why you chose this path
} catch (ServiceUnavailableException e) {
    // What now?
}
```

### Network Latency
Every service call adds milliseconds. 10 calls = potential 100ms+ overhead.

### Data Consistency
No more ACID transactions across services. Hello, eventual consistency and sagas!

### Operational Complexity
```
Monolith: 1 service to monitor
Microservices: 50 services × (logs + metrics + traces) = 💀
```

## My Recommendation

Ask yourself these questions:

1. **Do we have 20+ engineers?** If not, probably don't need microservices
2. **Is the domain well understood?** If not, start with a monolith
3. **Do we have DevOps expertise?** If not, the infrastructure will crush you
4. **Are we at significant scale?** If not, optimize the monolith first

## Conclusion

Microservices are a tool, not a goal. Use them when the benefits outweigh the costs. For most teams, a well-designed monolith is the right choice.

*Start simple, add complexity when needed.* ☾

---

**Tags:** `#architecture` `#microservices` `#monolith` `#distributed-systems` `#backend`

