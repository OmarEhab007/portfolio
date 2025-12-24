# Building a Retro Portfolio with Vanilla JS

*December 25, 2025*

---

## Why Retro?

In a world of React, Vue, and Next.js, sometimes the best approach is to go back to basics. This portfolio is built entirely with **vanilla HTML, CSS, and JavaScript** – no frameworks, no build steps, just pure web fundamentals.

The aesthetic is inspired by the early 2000s web – think Neocities, personal homepages, and the era when the web was *weird* and *wonderful*.

## The Tech Stack

Here's what powers this site:

- **HTML5** - Semantic markup
- **CSS3** - Custom properties, grid, flexbox
- **Vanilla JavaScript** - ES6+ features, no dependencies
- **Canvas API** - For the rain and stars effect

```javascript
// Simple, clean, no dependencies
class BackgroundEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    // Magic happens here ✨
  }
}
```

## Key Features

### 1. Rain & Stars Effect
The background uses the HTML5 Canvas API to render both twinkling stars and falling rain drops. It's GPU-accelerated and surprisingly performant.

### 2. Local Storage Persistence
Chat messages and guestbook entries are stored in `localStorage`, so they persist across sessions. In a real app, you'd use a backend, but this works great for a portfolio.

### 3. Easter Eggs
Try the Konami Code (↑↑↓↓←→←→BA) or click the coffee status 5 times! 

## The CSS Philosophy

```css
:root {
  --bg-dark: #0d0d0d;
  --text-cyan: #7dd3fc;
  --text-green: #86efac;
  --font-main: 'VT323', monospace;
}
```

I used CSS custom properties extensively for theming. The retro look comes from:
- Monospace fonts (VT323)
- Subtle gradients
- Terminal-style colors
- Dotted borders

## Lessons Learned

1. **Vanilla JS is powerful** - Modern JS has everything you need
2. **CSS has come so far** - Grid and custom properties are amazing
3. **Simplicity wins** - No build tools = no build problems
4. **The old web was fun** - We should bring back that energy

## Conclusion

Building this portfolio reminded me why I fell in love with web development. Sometimes you don't need the latest framework – you just need creativity and fundamentals.

*Keep building weird stuff on the web.* ☾

---

**Tags:** `#webdev` `#javascript` `#css` `#portfolio` `#retroaesthetic`

