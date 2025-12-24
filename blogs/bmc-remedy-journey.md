# My Journey with BMC Remedy ITSM

*December 20, 2025*

---

## Introduction

When I first heard "BMC Remedy," I thought it was some kind of medicine. Turns out, it's enterprise software that can either be your best friend or your worst nightmare – sometimes both in the same day.

## What is BMC Remedy?

BMC Remedy is an IT Service Management (ITSM) platform that helps organizations manage:

- **Incident Management** - When things break
- **Change Management** - When things need to change
- **Problem Management** - When things keep breaking
- **Asset Management** - Keeping track of all the things

```
┌─────────────────────────────────────┐
│         BMC Remedy Stack            │
├─────────────────────────────────────┤
│  Smart IT (Modern UI)               │
│  Mid Tier (Web Application)         │
│  AR Server (Core Engine)            │
│  Oracle/SQL Server (Database)       │
└─────────────────────────────────────┘
```

## The Learning Curve

### Week 1: "This seems manageable"
I opened Developer Studio for the first time. It looked like a regular IDE. Forms, fields, workflows. How hard could it be?

### Week 2: "What is an Active Link?"
Active Links, Filters, Escalations – the three horsemen of Remedy automation. Each has its own execution context and quirks.

```
Active Link  → User-triggered (client-side)
Filter       → Database operation triggered (server-side)
Escalation   → Time-based (scheduled)
```

### Week 4: "Why won't this Push Field work?"
The debugging experience is... unique. Sometimes you just stare at logs for hours.

### Month 3: "I actually understand this now"
Everything clicked. The platform is powerful once you understand its philosophy.

## Key Concepts I Learned

### 1. The AR System Architecture

The AR Server is the brain. It processes all business logic through:
- **Forms** (data structures)
- **Workflows** (automation rules)
- **Views** (UI layouts)

### 2. Integration Patterns

```java
// REST API Integration Example
ARServerUser user = new ARServerUser();
user.setServer("remedyserver.company.com");
user.setUser("Demo");
user.setPassword("password");

Entry entry = new Entry();
entry.put(1, "INC000001"); // Incident ID
```

### 3. Best Practices

1. **Always use overlay** - Never modify out-of-box objects directly
2. **Document everything** - Future you will thank present you
3. **Test in dev first** - Production is not a testing environment
4. **Use naming conventions** - Prefix custom objects consistently

## The Good Parts

- **Highly customizable** - You can build almost anything
- **Enterprise-grade** - Scales to massive organizations
- **ITIL alignment** - Built around best practices
- **Integration capabilities** - REST APIs, web services, events

## The Challenging Parts

- **Steep learning curve** - Takes months to be proficient
- **Legacy UI** - Smart IT helps, but some things feel dated
- **Debugging** - Can be frustrating at times
- **Performance tuning** - Requires deep platform knowledge

## Tips for New Remedy Developers

1. **Read the documentation** - BMC Docs are actually good
2. **Join the community** - BMC Communities has answers
3. **Practice workflows** - The more you build, the better you get
4. **Understand the data model** - Know your forms and relationships
5. **Learn SQL** - You'll need it for reporting

## Conclusion

BMC Remedy is a powerful platform that rewards patience and persistence. It's not the flashiest technology, but it solves real enterprise problems at scale.

If you're starting your Remedy journey, embrace the complexity. It gets easier, and the skills are valuable.

*Happy automating!* ☾

---

**Tags:** `#BMCRemedy` `#ITSM` `#Enterprise` `#Automation` `#ARServer`

