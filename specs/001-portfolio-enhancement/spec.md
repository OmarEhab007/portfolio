# Feature Specification: Portfolio Enhancement

**Feature Branch**: `001-portfolio-enhancement`
**Created**: 2026-03-15
**Status**: Draft
**Input**: User description: "Enhance portfolio with new projects (RemedyIQ, bmc-remedy-rag-agent), technical blog posts, updated skills section, and full UI/UX polish including animations, branded buttons, and canvas effects"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - View Latest Projects (Priority: P1)

A visitor lands on the portfolio and immediately sees the two most recent and impressive projects — RemedyIQ and BMC Remedy RAG Agent — at the top of the Projects section with clear descriptions, tech highlights, and links to the GitHub repositories.

**Why this priority**: Projects are the primary content visitors evaluate. Showcasing the most impressive and recent work first creates the strongest first impression.

**Independent Test**: Can be fully tested by loading index.html and verifying the two new projects appear at the top with correct descriptions, links, and formatting.

**Acceptance Scenarios**:

1. **Given** a visitor loads the portfolio homepage, **When** they scroll to the Projects section, **Then** RemedyIQ is the first project listed with its description and GitHub link
2. **Given** a visitor loads the portfolio homepage, **When** they scroll to the Projects section, **Then** BMC Remedy RAG Agent is the second project listed with its description and GitHub link
3. **Given** a visitor clicks a project link, **When** the link opens, **Then** it navigates to the correct GitHub repository in a new tab
4. **Given** a visitor views projects on mobile, **When** the viewport is under 600px, **Then** projects display correctly in single-column layout

---

### User Story 2 - Read Technical Blog Posts (Priority: P1)

A visitor navigates to the Blog section and reads in-depth technical articles about how RemedyIQ and the RAG Agent were built — including architecture decisions, technology choices, and implementation details with code snippets.

**Why this priority**: Blog posts demonstrate technical depth and thought leadership. They transform the portfolio from a list of links into a knowledge resource.

**Independent Test**: Can be fully tested by clicking blog links from the homepage, verifying markdown renders correctly with code highlighting, and navigating back to the blog list.

**Acceptance Scenarios**:

1. **Given** a visitor is on the homepage, **When** they click the RemedyIQ blog link, **Then** the full article renders with formatted headings, code blocks with syntax highlighting, and readable prose
2. **Given** a visitor is on the homepage, **When** they click the RAG Agent blog link, **Then** the full article renders correctly
3. **Given** a visitor is on the blog listing page, **When** they view all posts, **Then** the two new posts appear at the top in chronological order
4. **Given** a visitor reads a blog post, **When** they view code snippets, **Then** code is syntax-highlighted with the correct language

---

### User Story 3 - Discover Updated Skills (Priority: P2)

A visitor reviews the Skills section and sees an accurate, current representation of Omar's technical capabilities — including AI/RAG technologies, Go ecosystem tools, and specialized data stores gained from recent projects.

**Why this priority**: Skills validation is a key signal for recruiters and collaborators, but it's secondary to seeing the actual work.

**Independent Test**: Can be fully tested by loading the homepage and verifying new skill tags appear within the correct groups.

**Acceptance Scenarios**:

1. **Given** a visitor views the Skills section, **When** they look at "Backend & Languages", **Then** LangChain4j and React are listed among the tags
2. **Given** a visitor views the Skills section, **When** they look at "Databases & Messaging", **Then** ClickHouse, pgvector, NATS JetStream, and MinIO are listed
3. **Given** a visitor views the Skills section, **When** they look at "BMC Remedy", **Then** AR Log Analysis and ITSM Automation are listed
4. **Given** a visitor views skills on mobile, **When** the viewport is under 600px, **Then** skills grid switches to single column

---

### User Story 4 - Experience Polished UI on First Visit (Priority: P2)

A first-time visitor experiences smooth, staggered entrance animations as sections reveal on scroll, satisfying hover micro-interactions on interactive elements, and a refined canvas background with parallax stars and realistic rain.

**Why this priority**: Visual polish creates a memorable first impression and demonstrates frontend craft, but the content must exist first for the animations to enhance.

**Independent Test**: Can be fully tested by loading the page and observing entrance animations, hovering over project links / skill tags / nav links, and moving the mouse to see star parallax.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page, **When** boxes appear in the viewport, **Then** they fade in and slide up with staggered timing (each box delayed slightly after the previous)
2. **Given** a visitor hovers over a project link, **When** the mouse enters the element, **Then** a smooth underline slides in from the left with a subtle glow
3. **Given** a visitor hovers over a skill tag, **When** the mouse enters, **Then** the tag scales up slightly with an accent border glow
4. **Given** a visitor moves their mouse across the page, **When** the cursor moves, **Then** stars in the background subtly shift creating a parallax depth effect
5. **Given** a visitor watches the rain, **When** drops reach the bottom of the screen, **Then** small splash effects appear

---

### User Story 5 - Interact with Custom Branded Buttons (Priority: P3)

A visitor sees custom 88x31 pixel buttons in the sidebar that reflect Omar's brand and projects — RemedyIQ (green), RAG Agent (yellow), Go+Java (purple), Dark Mode (moon) — each with distinct hover glow effects.

**Why this priority**: Buttons are a retro web tradition that adds personality, but they're decorative rather than functional.

**Independent Test**: Can be fully tested by scrolling to the buttons section and hovering over each button to verify distinct colors and glow effects.

**Acceptance Scenarios**:

1. **Given** a visitor views the Buttons section, **When** they see the buttons, **Then** four branded buttons are displayed: RemedyIQ, RAG Agent, Go+Java, Dark
2. **Given** a visitor hovers over the RemedyIQ button, **When** the hover effect triggers, **Then** the button glows green
3. **Given** a visitor clicks the RemedyIQ button, **When** the link activates, **Then** it opens the RemedyIQ GitHub repository
4. **Given** a visitor views buttons on mobile, **When** the viewport is narrow, **Then** buttons wrap and center correctly

---

### User Story 6 - Experience Polished Banner Animations (Priority: P3)

A visitor sees the banner images in the sidebar enter with staggered slide-in animations, float with subtle smooth motion, and tilt in 3D perspective on hover.

**Why this priority**: Banner polish is the final visual touch that elevates the overall aesthetic, but doesn't affect content or core interactions.

**Independent Test**: Can be fully tested by loading the page and observing banner entrance, watching their idle float animation, and hovering to see the 3D tilt effect.

**Acceptance Scenarios**:

1. **Given** a visitor loads the page, **When** banners become visible, **Then** they enter with staggered slide-in animations from the left
2. **Given** a visitor watches the banners, **When** they idle, **Then** banners float with smooth, subtle vertical motion
3. **Given** a visitor hovers a banner, **When** the mouse enters, **Then** the banner scales slightly and tilts with a 3D perspective effect with neon glow

---

### Edge Cases

- What happens when blog markdown files fail to load? The blog system shows a loading state; if fetch fails, a user-friendly error message is displayed.
- What happens when the canvas background is on a low-performance device? The 30fps throttle ensures performance doesn't degrade; rain and star counts are capped.
- What happens with very long project descriptions? Descriptions are kept concise (under 200 characters) and overflow is handled by the existing layout.
- What happens when JavaScript is disabled? Content (projects, skills, blog links) is static HTML and remains fully accessible. Only animations and interactive widgets are affected.
- What happens on screen readers? Focus-visible states ensure keyboard navigation works. Semantic HTML (lists, headings, links) is preserved for assistive technology.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Homepage MUST display RemedyIQ as the first project in the Projects section with description and GitHub link
- **FR-002**: Homepage MUST display BMC Remedy RAG Agent as the second project in the Projects section with description and GitHub link
- **FR-003**: Skills section MUST include LangChain4j, React in "Backend & Languages" group
- **FR-004**: Skills section MUST include ClickHouse, pgvector, NATS JetStream, MinIO in "Databases & Messaging" group
- **FR-005**: Skills section MUST include AR Log Analysis, ITSM Automation in "BMC Remedy" group
- **FR-006**: Blog system MUST serve a technical deep-dive article about RemedyIQ with proper markdown rendering and code highlighting
- **FR-007**: Blog system MUST serve a technical deep-dive article about BMC Remedy RAG Agent with proper markdown rendering and code highlighting
- **FR-008**: Blog index MUST list the two new posts at the top in reverse chronological order
- **FR-009**: Homepage blog section MUST include links to both new blog posts
- **FR-010**: All page sections MUST animate in with a staggered fade-slide-up effect on initial load and scroll
- **FR-011**: Project links MUST display a sliding underline with glow on hover
- **FR-012**: Skill tags MUST scale up with accent border glow on hover
- **FR-013**: Navigation links MUST shift right on hover with background highlight
- **FR-014**: Blog list items MUST show background highlight on hover
- **FR-015**: Stars background MUST respond to mouse movement with parallax offset
- **FR-016**: Rain drops MUST have variable thickness and splash effects at the bottom edge
- **FR-017**: Canvas animation MUST be throttled to approximately 30 frames per second
- **FR-018**: Buttons section MUST display four custom branded 88x31 buttons: RemedyIQ (green), RAG Agent (yellow), Go+Java (purple), Dark (moon/gold)
- **FR-019**: Each branded button MUST have a distinct hover glow matching its accent color
- **FR-020**: Banner animations MUST use smooth floating motion with staggered entrance and 3D perspective tilt on hover
- **FR-021**: Interactive elements MUST show a visible focus outline when navigated via keyboard (focus-visible)
- **FR-022**: Footer MUST display updated copyright year range (2024-2026)
- **FR-023**: Scrollbar MUST be styled to match the site's dark theme with rounded thumb and accent color on hover

### Key Entities

- **Project**: Title, description, GitHub URL, display order position
- **Blog Post**: ID (slug), title, date, formatted date, description, tags array, markdown file path
- **Skill Tag**: Label text, skill group membership (one of 4 groups)
- **Branded Button**: Label, link URL, accent color variant, hover glow color

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Visitors see the two newest projects within the first scroll of the Projects section (above-the-fold for the section)
- **SC-002**: Both blog posts render fully with formatted headings, syntax-highlighted code, and readable content in under 2 seconds
- **SC-003**: All 8 new skill tags are visible and correctly grouped in the Skills section
- **SC-004**: Page load entrance animations complete within 1.5 seconds of DOM ready, with no visible layout shift
- **SC-005**: All hover interactions respond within 150ms with smooth transitions (no jank or lag)
- **SC-006**: Background canvas maintains smooth performance at 30fps on mid-range devices
- **SC-007**: All 4 branded buttons display with correct colors and hover effects
- **SC-008**: Page remains fully navigable via keyboard with visible focus indicators on all interactive elements
- **SC-009**: Portfolio displays correctly on viewports from 320px to 1920px wide
- **SC-010**: All external links (GitHub repos, blog posts) navigate to correct destinations

## Assumptions

- The portfolio remains a static vanilla HTML/CSS/JS site with no build system or framework
- The retro/neocities aesthetic is preserved — polish only, no redesign
- Blog posts are written in English, targeting a technical audience (fellow engineers)
- RemedyIQ and bmc-remedy-rag-agent GitHub repositories are public and accessible
- The existing blog system (marked.js + highlight.js) handles the new markdown content without modification
- Existing projects remain in the list below the two new additions
- No backend or API changes are needed — all content is static
