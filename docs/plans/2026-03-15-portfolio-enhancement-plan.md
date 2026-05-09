# Portfolio Enhancement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enhance the omar.dev portfolio with two new projects, two technical blog posts, updated skills, and a full UI/UX polish pass while preserving the retro aesthetic.

**Architecture:** Static vanilla HTML/CSS/JS SPA. Content changes are direct HTML edits + new markdown files. UI polish is CSS animations + JS IntersectionObserver enhancements. No build system or framework changes.

**Tech Stack:** HTML5, CSS3 (custom properties, animations, grid), Vanilla ES6+ JavaScript, marked.js (blog)

---

## Phase 1: Content Updates

### Task 1: Add RemedyIQ and BMC Remedy RAG Agent to Projects Section

**Files:**
- Modify: `index.html:97-139` (projects-box)

**Step 1: Add the two new projects at the top of the projects list**

In `index.html`, replace the projects list content (lines 98-137) with the two new projects prepended before existing ones:

```html
<div class="box-content">
  <ul class="projects-list">
    <li>
      <a href="https://github.com/OmarEhab007/RemedyIQ" target="_blank" class="project-link">
        <span class="project-icon">☾</span> RemedyIQ
      </a>
      <p class="project-desc">Enterprise log intelligence platform for BMC Remedy AR Server. Built with Go 1.24, Next.js 16, ClickHouse, NATS JetStream, and AI-powered analysis via Gemini & Anthropic. <a href="https://github.com/OmarEhab007/RemedyIQ" target="_blank">Link</a></p>
    </li>
    <li>
      <a href="https://github.com/OmarEhab007/bmc-remedy-rag-agent" target="_blank" class="project-link">
        <span class="project-icon">☾</span> BMC Remedy RAG Agent
      </a>
      <p class="project-desc">On-premise RAG agent for BMC Remedy ITSM with local embeddings and semantic search. Java 17, Spring Boot 3.2, LangChain4j, pgvector. 100% air-gapped. <a href="https://github.com/OmarEhab007/bmc-remedy-rag-agent" target="_blank">Link</a></p>
    </li>
    <!-- ...existing 5 projects remain unchanged below... -->
  </ul>
  <!-- ...existing other-projects div unchanged... -->
</div>
```

**Step 2: Verify the page renders correctly**

Open `index.html` in browser. Confirm:
- RemedyIQ appears first in the projects list
- BMC Remedy RAG Agent appears second
- Existing 5 projects still display correctly
- Links work and open in new tabs

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: add RemedyIQ and BMC Remedy RAG Agent to projects section"
```

---

### Task 2: Update Skills Section

**Files:**
- Modify: `index.html:146-199` (skills-box)

**Step 1: Add new skills to existing groups**

Update the skills grid in `index.html`:

**Backend & Languages group** (after existing tags, before closing `</div>`):
```html
<span class="skill-tag">LangChain4j</span>
<span class="skill-tag">React</span>
```

**Databases & Messaging group** (after existing tags):
```html
<span class="skill-tag">ClickHouse</span>
<span class="skill-tag">pgvector</span>
<span class="skill-tag">NATS JetStream</span>
<span class="skill-tag">MinIO</span>
```

**BMC Remedy group** (after existing tags):
```html
<span class="skill-tag">AR Log Analysis</span>
<span class="skill-tag">ITSM Automation</span>
```

**Step 2: Verify all skill tags render correctly**

Open `index.html` in browser. Confirm all 4 groups display the new tags correctly in the 2-column grid.

**Step 3: Commit**

```bash
git add index.html
git commit -m "feat: update skills section with AI, data, and BMC technologies"
```

---

### Task 3: Write RemedyIQ Technical Deep-Dive Blog Post

**Files:**
- Create: `blogs/building-remedyiq.md`

**Step 1: Write the blog post markdown**

Create `blogs/building-remedyiq.md` with a technical deep-dive covering:

1. **Introduction** — The problem: AR Server logs are massive, unstructured, and hard to search. RemedyIQ transforms them into queryable, analyzable data.

2. **Architecture Overview** — 3-service microservice design:
   - Frontend (Next.js 16 + React 19, port 3000)
   - API Service (Go REST + SSE + WebSocket, port 8080)
   - Worker Service (Go background processor, NATS consumer)

3. **Why Go?** — Concurrency model fits log processing. gorilla/mux for routing. Comparison with Java alternative.

4. **Data Layer Design** — Why ClickHouse for parsed log events (columnar storage, time-series queries). PostgreSQL for metadata. Redis for caching. MinIO for file storage. Bleve for full-text search.

5. **AI Analysis Modes** — 6 analysis modes (performance, root_cause, error_explainer, anomaly_narrator, summarizer, nl_query). Streaming SSE implementation. Skill-based routing. Multi-turn conversations.

6. **NATS JetStream for Job Queue** — Why NATS over Kafka for this use case. Reliable job delivery. Worker processing pipeline.

7. **KQL Search Engine** — Kusto Query Language parsing. Autocomplete. Saved searches. Export to CSV/JSON.

8. **Transaction Tracing** — Waterfall visualization. Trace search and export.

9. **Lessons Learned** — Key takeaways from building the platform.

Write in first-person technical voice. Include code snippets showing Go handler patterns, SSE streaming, and ClickHouse queries. ~1500-2000 words.

**Step 2: Verify markdown renders correctly**

Check that the markdown has proper headings, code blocks with language tags, and no formatting issues.

**Step 3: Commit**

```bash
git add blogs/building-remedyiq.md
git commit -m "feat: add RemedyIQ technical deep-dive blog post"
```

---

### Task 4: Write BMC Remedy RAG Agent Technical Deep-Dive Blog Post

**Files:**
- Create: `blogs/building-rag-agent.md`

**Step 1: Write the blog post markdown**

Create `blogs/building-rag-agent.md` with a technical deep-dive covering:

1. **Introduction** — The problem: institutional knowledge locked in ITSM ticket histories. Solution: RAG transforms years of IT support into instant, context-aware answers.

2. **RAG Architecture** — End-to-end pipeline: data ingestion → chunking → embedding → vector storage → retrieval → generation. Why RAG over fine-tuning.

3. **LangChain4j + Spring Boot** — Java-native LLM orchestration. Integration patterns. Chat memory management.

4. **Local Embeddings with ONNX** — all-minilm-l6-v2 model (384 dimensions). Why local over API calls. ONNX runtime performance.

5. **pgvector + Hybrid Search** — Vector similarity + full-text search. Reciprocal Rank Fusion (RRF). HNSW indexing. Why PostgreSQL over dedicated vector DBs.

6. **ReBAC Security Model** — Relationship-Based Access Control. Multi-tenant data isolation. Users only see authorized group data.

7. **Agentic Operations** — Incident creation with confirmation workflow. Duplicate detection. Tool Server endpoints. Rate limiting.

8. **Air-Gapped Deployment** — Zero cloud dependencies. Ollama for local LLM. Docker + Kubernetes deployment. Resource requirements.

9. **Bilingual Support** — English + Arabic RTL. Challenges and solutions.

10. **Lessons Learned** — Key takeaways.

Write in first-person technical voice. Include code snippets showing Spring Boot RAG configuration, pgvector queries, and LangChain4j patterns. ~1500-2000 words.

**Step 2: Verify markdown renders correctly**

**Step 3: Commit**

```bash
git add blogs/building-rag-agent.md
git commit -m "feat: add BMC Remedy RAG Agent technical deep-dive blog post"
```

---

### Task 5: Update Blog Index and Homepage Blog Links

**Files:**
- Modify: `blogs/index.json` (prepend 2 entries)
- Modify: `index.html:208-236` (blog-box list)

**Step 1: Add new blog entries to index.json**

Prepend these two entries to the `blogs` array in `blogs/index.json`:

```json
{
  "id": "building-remedyiq",
  "title": "Building RemedyIQ: Enterprise Log Intelligence with Go & AI",
  "date": "2026-03-15",
  "dateFormatted": "Sunday, Mar 15th, 2026",
  "description": "Architecture deep-dive into RemedyIQ — a 3-service Go platform for AR Server log analysis with AI-powered insights.",
  "tags": ["go", "ai", "architecture", "clickhouse", "bmc-remedy"],
  "file": "building-remedyiq.md"
},
{
  "id": "building-rag-agent",
  "title": "Building an Air-Gapped RAG Agent for BMC Remedy",
  "date": "2026-03-10",
  "dateFormatted": "Tuesday, Mar 10th, 2026",
  "description": "How I built an on-premise RAG agent with LangChain4j, pgvector, and local embeddings for BMC Remedy ITSM.",
  "tags": ["java", "rag", "ai", "langchain4j", "bmc-remedy"],
  "file": "building-rag-agent.md"
}
```

**Step 2: Add new blog links to homepage**

In `index.html`, prepend two new `<li>` items to the `.blog-list` (before the existing 5):

```html
<li>
  <span class="blog-bullet">-</span>
  <a href="blog.html?post=building-remedyiq">Building RemedyIQ: Enterprise Log Intelligence with Go & AI</a>
  <span class="blog-date">— Sunday, Mar 15th, 2026</span>
</li>
<li>
  <span class="blog-bullet">-</span>
  <a href="blog.html?post=building-rag-agent">Building an Air-Gapped RAG Agent for BMC Remedy</a>
  <span class="blog-date">— Tuesday, Mar 10th, 2026</span>
</li>
```

**Step 3: Verify blog links work**

Open `index.html`, click both new blog links, confirm they load the correct markdown content in `blog.html`.

**Step 4: Commit**

```bash
git add blogs/index.json index.html
git commit -m "feat: add new blog posts to index and homepage"
```

---

## Phase 2: UI/UX Polish

### Task 6: Add Staggered Entrance Animations

**Files:**
- Modify: `assets/css/style.css` (add new section after #NOTIFICATION ~line 1141)
- Modify: `assets/js/script.js` (add ScrollReveal class before INITIALIZE ~line 656)

**Step 1: Add CSS for entrance animation**

Add to `style.css` after the `#NOTIFICATION` section:

```css
/*-----------------------------------*\
  #ENTRANCE ANIMATIONS
\*-----------------------------------*/

.box {
  opacity: 0;
  transform: translateY(20px);
}

.box.visible {
  animation: fadeSlideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes fadeSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Step 2: Add JS IntersectionObserver for scroll-triggered reveals**

Add `ScrollReveal` class to `script.js` before the INITIALIZE section:

```javascript
// ============================================
// SCROLL REVEAL
// ============================================

class ScrollReveal {
  constructor() {
    this.boxes = document.querySelectorAll('.box');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            // Stagger based on position in the DOM
            const box = entry.target;
            const delay = Array.from(this.boxes).indexOf(box) * 50;
            setTimeout(() => {
              box.classList.add('visible');
            }, delay);
            this.observer.unobserve(box);
          }
        });
      },
      { threshold: 0.1 }
    );

    this.boxes.forEach(box => this.observer.observe(box));
  }
}
```

Initialize it in DOMContentLoaded:
```javascript
new ScrollReveal();
```

**Step 3: Verify animations work**

Reload page. Confirm boxes fade in with staggered timing. Scroll down to trigger lower boxes.

**Step 4: Commit**

```bash
git add assets/css/style.css assets/js/script.js
git commit -m "feat: add staggered entrance animations with IntersectionObserver"
```

---

### Task 7: Enhance Hover Micro-Interactions

**Files:**
- Modify: `assets/css/style.css` (update existing hover rules)

**Step 1: Enhance project link hover**

Update `.project-link` styles in style.css (around line 308-313):

```css
.project-link {
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  position: relative;
}

.project-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 1px;
  background: var(--text-cyan);
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(125, 211, 252, 0.4);
}

.project-link:hover::after {
  width: 100%;
}
```

**Step 2: Enhance skill tag hover**

Update `.skill-tag` styles (around line 361-369):

```css
.skill-tag {
  display: inline-block;
  font-size: 14px;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  margin: 2px;
  border: 1px solid var(--border-main);
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-tag:hover {
  transform: scale(1.05);
  border-color: var(--text-cyan);
  color: var(--text-cyan);
  box-shadow: 0 0 8px rgba(125, 211, 252, 0.2);
}
```

**Step 3: Enhance nav link hover**

Update `.nav-link` styles (around line 573-582):

```css
.nav-link {
  font-size: 16px;
  display: block;
  padding: 4px 8px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  padding-left: 8px;
}

.nav-link:hover {
  background: rgba(147, 197, 253, 0.1);
  padding-left: 14px;
}
```

**Step 4: Enhance blog entry hover**

Update `.blog-list li` styles (around line 275-278):

```css
.blog-list li {
  padding: 6px 4px;
  border-bottom: 1px dotted var(--border-main);
  transition: background 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.blog-list li:hover {
  background: rgba(125, 211, 252, 0.05);
}
```

**Step 5: Add box hover depth**

Update `.box` base styles (around line 156-160):

```css
.box {
  background: var(--bg-box);
  border: 1px solid var(--border-main);
  border-radius: var(--border-radius);
  transition: border-color 0.3s cubic-bezier(0.4, 0, 0.2, 1),
              box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.box:hover {
  border-color: var(--border-hover);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
}
```

**Step 6: Verify all hover effects**

Test each element type: project links, skill tags, nav links, blog entries, boxes. Confirm smooth transitions.

**Step 7: Commit**

```bash
git add assets/css/style.css
git commit -m "feat: enhance hover micro-interactions with smooth transitions"
```

---

### Task 8: Polish Background Canvas

**Files:**
- Modify: `assets/js/script.js` (BackgroundEffect class, lines 12-186)

**Step 1: Add mouse parallax for stars**

Add mouse tracking to BackgroundEffect constructor (after line 32):

```javascript
// Mouse parallax
this.mouseX = 0;
this.mouseY = 0;
document.addEventListener('mousemove', (e) => {
  this.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
  this.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});
```

Update `drawStars()` to offset star positions by mouse parallax:

```javascript
// In drawStars, when drawing, offset position:
const parallaxX = this.mouseX * star.size * 3;
const parallaxY = this.mouseY * star.size * 3;
const drawX = star.x + parallaxX;
const drawY = star.y + parallaxY;
// Use drawX, drawY instead of star.x, star.y for rendering
```

**Step 2: Improve rain physics**

Update `createRain()` to add variable thickness:

```javascript
this.raindrops.push({
  x: Math.random() * this.canvas.width,
  y: Math.random() * this.canvas.height,
  length: Math.random() * 20 + 10,
  speed: Math.random() * 5 + 8,
  opacity: Math.random() * 0.3 + 0.1,
  thickness: Math.random() * 1.5 + 0.5,
  wind: Math.random() * 0.8 + 0.2
});
```

Update `drawRain()` to use variable thickness and wind, and add splash effect:

```javascript
// Use drop.thickness for lineWidth
this.ctx.lineWidth = drop.thickness;

// Use drop.wind instead of hardcoded 0.5
drop.x += drop.wind;

// Add splash when raindrop reaches bottom
if (drop.y > this.canvas.height) {
  // Draw splash
  this.ctx.beginPath();
  this.ctx.fillStyle = `rgba(125, 211, 252, ${drop.opacity * 0.5})`;
  this.ctx.arc(drop.x, this.canvas.height - 2, drop.thickness * 2, 0, Math.PI * 2);
  this.ctx.fill();

  // Reset
  drop.y = -drop.length;
  drop.x = Math.random() * this.canvas.width;
}
```

**Step 3: Throttle to ~30fps**

Replace the animate loop with frame-rate limiting:

```javascript
animate() {
  const now = performance.now();
  if (now - (this.lastFrame || 0) < 33) { // ~30fps
    requestAnimationFrame(() => this.animate());
    return;
  }
  this.lastFrame = now;

  // ...existing draw code...
  requestAnimationFrame(() => this.animate());
}
```

**Step 4: Verify canvas effects**

Reload page. Move mouse — stars should subtly shift. Rain should have variable thickness with small splashes at bottom. Performance should be smooth.

**Step 5: Commit**

```bash
git add assets/js/script.js
git commit -m "feat: polish background canvas with parallax, rain physics, and fps throttle"
```

---

### Task 9: Replace 88x31 Buttons with Custom Branded Buttons

**Files:**
- Modify: `index.html:380-438` (buttons-box)
- Modify: `assets/css/style.css` (buttons section, lines 766-896)

**Step 1: Replace button HTML**

Replace the buttons-box content in `index.html` (lines 381-438):

```html
<div class="box buttons-box">
  <div class="box-header">Buttons</div>
  <div class="box-content buttons-content">
    <div class="buttons-grid">
      <a href="https://github.com/OmarEhab007/RemedyIQ" target="_blank" class="button-88x31 brand-remedyiq" title="RemedyIQ">
        <span>RemedyIQ</span>
      </a>
      <a href="https://github.com/OmarEhab007/bmc-remedy-rag-agent" target="_blank" class="button-88x31 brand-rag" title="RAG Agent">
        <span>RAG Agent</span>
      </a>
      <a href="https://github.com/OmarEhab007" target="_blank" class="button-88x31 brand-tech" title="Go + Java">
        <span>Go + Java</span>
      </a>
      <a href="#" class="button-88x31 brand-dark" title="Dark Mode">
        <span>☾ Dark</span>
      </a>
    </div>

    <!-- My Button -->
    <div class="my-button-section">
      <div class="button-88x31 my-button">
        <span>OMAR.DEV</span>
      </div>
      <div class="hotlink-code">
        <code>&lt;a href="https://omar.dev"&gt;&lt;img src="..."&gt;&lt;/a&gt;</code>
        <p class="hotlink-note">DO hotlink my button!</p>
      </div>
    </div>

    <!-- Webring -->
    <div class="webring">
      <a href="#" class="webring-link">&lt;--</a>
      <span class="webring-name">Developer Webring</span>
      <a href="#" class="webring-link">--&gt;</a>
    </div>
  </div>
</div>
```

**Step 2: Add branded button CSS styles**

Add to `style.css` after existing `.button-88x31` rules:

```css
/* Branded button variants */
.button-88x31.brand-remedyiq {
  background: linear-gradient(180deg, #1a3a2a 0%, #0a1510 100%);
  border-color: var(--text-green);
}

.button-88x31.brand-remedyiq:hover {
  border-color: var(--text-green);
  box-shadow: 0 0 10px rgba(134, 239, 172, 0.4);
  color: var(--text-green);
}

.button-88x31.brand-rag {
  background: linear-gradient(180deg, #3a3a1a 0%, #151510 100%);
  border-color: var(--text-yellow);
}

.button-88x31.brand-rag:hover {
  border-color: var(--text-yellow);
  box-shadow: 0 0 10px rgba(253, 224, 71, 0.4);
  color: var(--text-yellow);
}

.button-88x31.brand-tech {
  background: linear-gradient(180deg, #2a2a3a 0%, #10101a 100%);
  border-color: var(--text-purple);
}

.button-88x31.brand-tech:hover {
  border-color: var(--text-purple);
  box-shadow: 0 0 10px rgba(196, 181, 253, 0.4);
  color: var(--text-purple);
}

.button-88x31.brand-dark {
  background: linear-gradient(180deg, #2a2a1a 0%, #101008 100%);
  border-color: var(--accent-moon);
}

.button-88x31.brand-dark:hover {
  border-color: var(--accent-moon);
  box-shadow: 0 0 10px rgba(255, 255, 212, 0.3);
  color: var(--accent-moon);
}
```

**Step 3: Verify buttons render and hover correctly**

**Step 4: Commit**

```bash
git add index.html assets/css/style.css
git commit -m "feat: replace generic buttons with custom branded 88x31 buttons"
```

---

### Task 10: Polish Banner Section Animations

**Files:**
- Modify: `assets/css/style.css` (banners section, lines 656-764)

**Step 1: Replace floating/gliding with smoother animations**

Replace the banner animation CSS (lines 698-764) with:

```css
/* Smooth banner animations */
.banner-link .banner-img {
  animation: bannerFloat 6s ease-in-out infinite;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.banner-link:nth-child(even) .banner-img {
  animation-delay: -3s;
}

@keyframes bannerFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  25% {
    transform: translateY(-4px) rotate(0.5deg);
  }
  75% {
    transform: translateY(4px) rotate(-0.5deg);
  }
}

/* 3D tilt on hover */
.banner-link:hover .banner-img {
  filter: brightness(1.3) drop-shadow(0 0 10px rgba(125, 211, 252, 0.6));
  transform: scale(1.08) perspective(500px) rotateY(5deg);
  opacity: 1;
}

/* Staggered entrance for banners */
.banner-link {
  opacity: 0;
  animation: bannerEnter 0.4s ease forwards;
}

.banner-link:nth-child(1) { animation-delay: 0.1s; }
.banner-link:nth-child(2) { animation-delay: 0.2s; }
.banner-link:nth-child(3) { animation-delay: 0.3s; }
.banner-link:nth-child(4) { animation-delay: 0.4s; }
.banner-link:nth-child(5) { animation-delay: 0.5s; }
.banner-link:nth-child(6) { animation-delay: 0.6s; }

@keyframes bannerEnter {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 0.8;
    transform: translateX(0);
  }
}
```

Remove the old `.banner-link.floating` and `.banner-link.gliding` classes and their `@keyframes float` / `@keyframes glide` definitions.

Also remove `floating` and `gliding` classes from banner links in `index.html`.

**Step 2: Verify banner animations**

Reload page. Banners should enter with staggered slide-in, float smoothly, and tilt on hover.

**Step 3: Commit**

```bash
git add assets/css/style.css index.html
git commit -m "feat: polish banner animations with 3D tilt and staggered entrance"
```

---

### Task 11: General Polish (Scrollbar, Focus States, Footer)

**Files:**
- Modify: `assets/css/style.css` (scrollbar section ~1020, footer ~1004)
- Modify: `index.html:446` (footer year)

**Step 1: Enhance scrollbar styling**

Update the scrollbar section in `style.css` (lines 1020-1035):

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-dark);
}

::-webkit-scrollbar-thumb {
  background: var(--border-main);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--text-cyan);
}

/* Firefox scrollbar */
* {
  scrollbar-width: thin;
  scrollbar-color: var(--border-main) var(--bg-dark);
}
```

**Step 2: Add focus-visible states for accessibility**

Add after the scrollbar section:

```css
/*-----------------------------------*\
  #FOCUS STATES
\*-----------------------------------*/

a:focus-visible,
button:focus-visible,
input:focus-visible,
textarea:focus-visible {
  outline: 2px solid var(--text-cyan);
  outline-offset: 2px;
}
```

**Step 3: Update footer year**

In `index.html`, update line 446:
```html
<p>(c) 2024-2026 Omar Ehab. All Rights Reserved.</p>
```

**Step 4: Verify**

Check scrollbar appearance, tab through interactive elements for focus outlines, check footer text.

**Step 5: Commit**

```bash
git add assets/css/style.css index.html
git commit -m "feat: polish scrollbar, add focus states, update footer year"
```

---

## Summary

| Task | Phase | Description |
|------|-------|-------------|
| 1 | Content | Add RemedyIQ + RAG Agent to Projects |
| 2 | Content | Update Skills with new technologies |
| 3 | Content | Write RemedyIQ blog post |
| 4 | Content | Write RAG Agent blog post |
| 5 | Content | Update blog index + homepage links |
| 6 | UI/UX | Staggered entrance animations |
| 7 | UI/UX | Hover micro-interactions |
| 8 | UI/UX | Background canvas polish |
| 9 | UI/UX | Custom branded 88x31 buttons |
| 10 | UI/UX | Banner animation polish |
| 11 | UI/UX | Scrollbar, focus states, footer |
