/**
 * OMAR.DEV - dimden.dev inspired
 * Rain, Stars, Chat, Guestbook & More!
 */

'use strict';

// ============================================
// BACKGROUND CANVAS (RAIN + STARS)
// ============================================

class BackgroundEffect {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.stars = [];
    this.raindrops = [];
    this.numStars = 150;
    this.numRaindrops = 100;
    
    this.showStars = true;
    this.showRain = true;
    
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    
    // Controls
    this.setupControls();
  }
  
  init() {
    this.resize();
    this.createStars();
    this.createRain();
  }
  
  resize() {
    const oldWidth = this.canvas.width;
    const oldHeight = this.canvas.height;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    
    // Recreate stars if canvas was just initialized or dimensions changed significantly
    if (oldWidth === 0 && oldHeight === 0) {
      this.createStars();
    }
  }
  
  setupControls() {
    const starsToggle = document.getElementById('toggle-stars');
    const rainToggle = document.getElementById('toggle-rain');
    
    if (starsToggle) {
      starsToggle.addEventListener('change', (e) => {
        this.showStars = e.target.checked;
      });
    }
    
    if (rainToggle) {
      rainToggle.addEventListener('change', (e) => {
        this.showRain = e.target.checked;
      });
    }
  }
  
  createStars() {
    this.stars = [];
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 0.5,
        brightness: Math.random(),
        twinkleSpeed: Math.random() * 0.02 + 0.002,
        vx: (Math.random() - 0.5) * 0.2, // Random horizontal velocity
        vy: (Math.random() - 0.5) * 0.2  // Random vertical velocity
      });
    }
  }
  
  createRain() {
    this.raindrops = [];
    for (let i = 0; i < this.numRaindrops; i++) {
      this.raindrops.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 5 + 8,
        opacity: Math.random() * 0.3 + 0.1
      });
    }
  }
  
  animate() {
    // Clear canvas
    this.ctx.fillStyle = '#0d0d0d';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw stars
    if (this.showStars) {
      this.drawStars();
    }
    
    // Draw rain
    if (this.showRain) {
      this.drawRain();
    }
    
    requestAnimationFrame(() => this.animate());
  }
  
  drawStars() {
    this.stars.forEach(star => {
      // Twinkle
      star.brightness += star.twinkleSpeed;
      if (star.brightness > 1 || star.brightness < 0.2) {
        star.twinkleSpeed *= -1;
      }
      
      // Move star randomly
      star.x += star.vx;
      star.y += star.vy;
      
      // Wrap around screen edges
      if (star.x < 0) {
        star.x = this.canvas.width;
      } else if (star.x > this.canvas.width) {
        star.x = 0;
      }
      if (star.y < 0) {
        star.y = this.canvas.height;
      } else if (star.y > this.canvas.height) {
        star.y = 0;
      }
      
      // Draw
      this.ctx.beginPath();
      this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness * 0.8})`;
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
      
      // Glow for larger stars
      if (star.size > 1.5) {
        this.ctx.beginPath();
        const gradient = this.ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.brightness * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        this.ctx.fillStyle = gradient;
        this.ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    });
  }
  
  drawRain() {
    this.raindrops.forEach(drop => {
      // Draw raindrop
      this.ctx.beginPath();
      this.ctx.strokeStyle = `rgba(125, 211, 252, ${drop.opacity})`;
      this.ctx.lineWidth = 1;
      this.ctx.moveTo(drop.x, drop.y);
      this.ctx.lineTo(drop.x, drop.y + drop.length);
      this.ctx.stroke();
      
      // Move raindrop
      drop.y += drop.speed;
      drop.x += 0.5; // Slight wind effect
      
      // Reset if off screen
      if (drop.y > this.canvas.height) {
        drop.y = -drop.length;
        drop.x = Math.random() * this.canvas.width;
      }
      if (drop.x > this.canvas.width) {
        drop.x = 0;
      }
    });
  }
}

// ============================================
// CLOCK
// ============================================

class Clock {
  constructor() {
    this.timeElement = document.getElementById('local-time');
    if (this.timeElement) {
      this.update();
      setInterval(() => this.update(), 1000);
    }
  }
  
  update() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    this.timeElement.textContent = `${hours}:${minutes}`;
  }
}

// ============================================
// CHAT WIDGET
// ============================================

class ChatWidget {
  constructor() {
    this.messages = document.getElementById('chat-messages');
    this.input = document.getElementById('chat-input');
    this.sendBtn = document.getElementById('chat-send');
    this.storageKey = 'omar_chat_messages';
    
    if (this.messages && this.input && this.sendBtn) {
      this.loadMessages();
      this.setupListeners();
      this.simulateActivity();
    }
  }
  
  setupListeners() {
    this.sendBtn.addEventListener('click', () => this.sendMessage());
    this.input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') this.sendMessage();
    });
  }
  
  loadMessages() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const messages = JSON.parse(saved);
        messages.slice(-5).forEach(msg => {
          this.addMessage(msg.user, msg.text, msg.type, false);
        });
      } catch (e) {}
    }
  }
  
  sendMessage() {
    const text = this.input.value.trim();
    if (!text) return;
    
    const username = 'You';
    this.addMessage(username, text, 'visitor', true);
    this.input.value = '';
    
    // Random response after delay
    setTimeout(() => {
      const responses = [
        "Thanks for stopping by! 👋",
        "Cool message! 🌙",
        "Nice to see you here!",
        "Feel free to check out my projects!",
        "☕ *sips coffee*",
        "Welcome to the chat!",
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      this.addMessage('Omar', response, 'omar', true);
    }, 1000 + Math.random() * 2000);
  }
  
  addMessage(user, text, type, save = false) {
    const msgEl = document.createElement('div');
    msgEl.className = 'chat-msg';
    msgEl.innerHTML = `
      <span class="chat-user ${type}">${user}:</span>
      <span class="chat-text">${this.escapeHtml(text)}</span>
    `;
    this.messages.appendChild(msgEl);
    this.messages.scrollTop = this.messages.scrollHeight;
    
    if (save) {
      this.saveMessage({ user, text, type });
    }
  }
  
  saveMessage(msg) {
    let messages = [];
    try {
      messages = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {}
    messages.push(msg);
    messages = messages.slice(-20); // Keep last 20
    localStorage.setItem(this.storageKey, JSON.stringify(messages));
  }
  
  simulateActivity() {
    // Add random "visitor" message occasionally
    setInterval(() => {
      if (Math.random() < 0.1) {
        const visitors = ['Visitor_' + Math.floor(Math.random() * 100)];
        const messages = [
          'Nice site!',
          'Hello! 👋',
          '🌙',
          'Cool design',
          'Love the aesthetic',
        ];
        const visitor = visitors[0];
        const msg = messages[Math.floor(Math.random() * messages.length)];
        this.addMessage(visitor, msg, 'visitor', false);
      }
    }, 30000);
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// ============================================
// GUESTBOOK
// ============================================

class Guestbook {
  constructor() {
    this.entries = document.getElementById('guestbook-entries');
    this.nameInput = document.getElementById('gb-name');
    this.messageInput = document.getElementById('gb-message');
    this.submitBtn = document.getElementById('gb-submit');
    this.storageKey = 'omar_guestbook';
    
    if (this.entries && this.submitBtn) {
      this.loadEntries();
      this.submitBtn.addEventListener('click', () => this.addEntry());
    }
  }
  
  loadEntries() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const entries = JSON.parse(saved);
        // Clear default entries
        this.entries.innerHTML = '';
        entries.slice(-10).forEach(entry => this.renderEntry(entry));
      } catch (e) {}
    }
  }
  
  addEntry() {
    const name = this.nameInput.value.trim() || 'Anonymous';
    const message = this.messageInput.value.trim();
    
    if (!message) {
      this.showNotification('Please write a message!');
      return;
    }
    
    const entry = {
      name,
      message,
      date: new Date().toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    };
    
    this.renderEntry(entry);
    this.saveEntry(entry);
    
    this.nameInput.value = '';
    this.messageInput.value = '';
    
    this.showNotification('Thanks for signing! 🌙');
  }
  
  renderEntry(entry) {
    const el = document.createElement('div');
    el.className = 'gb-entry';
    el.innerHTML = `
      <span class="gb-name">${this.escapeHtml(entry.name)}</span>
      <span class="gb-date">${entry.date}</span>
      <p class="gb-msg">${this.escapeHtml(entry.message)}</p>
    `;
    this.entries.insertBefore(el, this.entries.firstChild);
  }
  
  saveEntry(entry) {
    let entries = [];
    try {
      entries = JSON.parse(localStorage.getItem(this.storageKey)) || [];
    } catch (e) {}
    entries.push(entry);
    entries = entries.slice(-50);
    localStorage.setItem(this.storageKey, JSON.stringify(entries));
  }
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.textContent = message;
    document.body.appendChild(notif);
    
    setTimeout(() => {
      notif.style.opacity = '0';
      notif.style.transition = 'opacity 0.3s';
      setTimeout(() => notif.remove(), 300);
    }, 2000);
  }
}

// ============================================
// MOOD TRACKER
// ============================================

class MoodTracker {
  constructor() {
    this.moodEl = document.getElementById('mood-tracker');
    if (this.moodEl) {
      this.updateMood();
      this.moodEl.addEventListener('click', (e) => {
        e.preventDefault();
        this.updateMood();
      });
    }
  }
  
  updateMood() {
    // Generate random mood values
    const positive = (Math.random() * 0.8 + 0.2).toFixed(2);
    const negative = (Math.random() * 0.5).toFixed(2);
    this.moodEl.textContent = `[ +${positive} / -${negative} ]`;
  }
}

// ============================================
// LAST.FM NOW PLAYING (SIMULATED)
// ============================================

class NowPlaying {
  constructor() {
    this.trackEl = document.getElementById('lastfm-track');
    this.artistEl = document.getElementById('lastfm-artist');
    this.timeEl = document.getElementById('lastfm-time');
    
    this.playlist = [
      { track: 'Midnight City', artist: 'M83' },
      { track: 'Resonance', artist: 'HOME' },
      { track: 'Digital Love', artist: 'Daft Punk' },
      { track: 'A Real Hero', artist: 'College & Electric Youth' },
      { track: 'Nightcall', artist: 'Kavinsky' },
      { track: 'Crystals', artist: 'M.O.O.N.' },
      { track: 'Tech Noir', artist: 'Gunship' },
      { track: 'Sunset', artist: 'The Midnight' },
      { track: 'Days of Thunder', artist: 'The Midnight' },
      { track: 'Tokyo Nights', artist: 'Digital Daggers' },
    ];
    
    this.times = [
      '2 minutes ago',
      '15 minutes ago',
      '1 hour ago',
      '2 hours ago',
      '3 hours ago',
    ];
    
    if (this.trackEl) {
      this.update();
      // Update every few minutes
      setInterval(() => this.update(), 180000);
    }
  }
  
  update() {
    const song = this.playlist[Math.floor(Math.random() * this.playlist.length)];
    const time = this.times[Math.floor(Math.random() * this.times.length)];
    
    if (this.trackEl) this.trackEl.textContent = song.track;
    if (this.artistEl) this.artistEl.textContent = song.artist;
    if (this.timeEl) this.timeEl.textContent = time;
  }
}

// ============================================
// STATUS MESSAGES
// ============================================

class StatusUpdater {
  constructor() {
    this.statusEl = document.getElementById('current-status-text');
    
    this.statuses = [
      "Probably debugging something at 3am ☕",
      "Writing clean code (allegedly) 💻",
      "In a meeting, send help 📊",
      "Deploying to prod on a Friday 😱",
      "Reading Stack Overflow 📚",
      "Fixing 'one small bug' for 4 hours 🐛",
      "Coffee break ☕",
      "In the zone 🎧",
      "Questioning life choices 🤔",
      "git push --force (just kidding) 😅",
    ];
    
    if (this.statusEl) {
      this.update();
      setInterval(() => this.update(), 60000);
    }
  }
  
  update() {
    const status = this.statuses[Math.floor(Math.random() * this.statuses.length)];
    this.statusEl.textContent = status;
  }
}

// ============================================
// COFFEE EASTER EGG
// ============================================

class CoffeeRefill {
  constructor() {
    this.coffeeEl = document.getElementById('coffee-status');
    this.refills = 0;
    
    if (this.coffeeEl) {
      this.coffeeEl.addEventListener('click', () => this.refill());
    }
  }
  
  refill() {
    this.refills++;
    const statusSpan = this.coffeeEl.querySelector('span');
    
    if (this.refills >= 5) {
      statusSpan.textContent = '[ ☠️ ]';
      statusSpan.className = 'status-error';
      this.coffeeEl.innerHTML = '<span class="status-error">[ ☠️ ]</span> OVERDOSE';
    } else if (this.refills >= 3) {
      statusSpan.textContent = '[ ++ ]';
      statusSpan.className = 'status-ok';
      this.coffeeEl.innerHTML = '<span class="status-ok">[ ++ ]</span> coffee MAX';
    } else {
      statusSpan.textContent = '[ OK ]';
      statusSpan.className = 'status-ok';
      this.coffeeEl.innerHTML = '<span class="status-ok">[ OK ]</span> coffee ☕';
    }
    
    console.log(`☕ Coffee refill #${this.refills}! Productivity +10%`);
  }
}

// ============================================
// KONAMI CODE
// ============================================

class KonamiCode {
  constructor() {
    this.sequence = [];
    this.code = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 
                 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 
                 'KeyB', 'KeyA'];
    
    document.addEventListener('keydown', (e) => this.check(e));
  }
  
  check(e) {
    this.sequence.push(e.code);
    
    if (this.sequence.length > this.code.length) {
      this.sequence.shift();
    }
    
    if (this.sequence.join(',') === this.code.join(',')) {
      this.activate();
      this.sequence = [];
    }
  }
  
  activate() {
    document.body.style.filter = 'hue-rotate(180deg)';
    
    const notif = document.createElement('div');
    notif.className = 'notification';
    notif.style.background = 'linear-gradient(90deg, #ff00ff, #00ffff)';
    notif.style.color = '#000';
    notif.textContent = '🎮 KONAMI CODE ACTIVATED!';
    document.body.appendChild(notif);
    
    setTimeout(() => {
      document.body.style.filter = '';
      notif.remove();
    }, 3000);
    
    console.log('%c🎮 Konami Code Activated!', 'color: #00ff00; font-size: 20px;');
  }
}

// ============================================
// CONSOLE WELCOME
// ============================================

function showConsoleWelcome() {
  console.log('%c' + `
  ╔═══════════════════════════════════╗
  ║       Welcome to OMAR.DEV!        ║
  ║   dimden.dev inspired portfolio   ║
  ╚═══════════════════════════════════╝
  `, 'color: #7dd3fc; font-family: monospace;');
  
  console.log('%c☾ Try the Konami Code! ↑↑↓↓←→←→BA', 'color: #86efac;');
  console.log('%c☾ Click the coffee status 5 times!', 'color: #86efac;');
  console.log('%c☾ Type hire() in console', 'color: #fde047;');
}

// Console commands
window.hire = function() {
  console.log('%c📧 oehab559@gmail.com', 'color: #7dd3fc; font-size: 14px;');
  console.log('%c🔗 linkedin.com/in/omar-e-a94808144', 'color: #7dd3fc; font-size: 14px;');
  return "Let's build something awesome!";
};

window.coffee = function() {
  console.log('%c☕ *refills your coffee*', 'color: #8B4513; font-size: 16px;');
  return "Productivity +10%";
};

// ============================================
// SMOOTH SCROLL FOR NAV LINKS
// ============================================

class SmoothScroll {
  constructor() {
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }
      });
    });
  }
}

// ============================================
// SCROLL REVEAL
// ============================================

class ScrollReveal {
  constructor() {
    this.boxes = document.querySelectorAll('.box');
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
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

// ============================================
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  // Background effects
  new BackgroundEffect('background-canvas');
  
  // Widgets
  new Clock();
  new ChatWidget();
  new Guestbook();
  new MoodTracker();
  new NowPlaying();
  new StatusUpdater();
  
  // Easter eggs
  new CoffeeRefill();
  new KonamiCode();
  
  // Navigation
  new SmoothScroll();

  // Scroll animations
  new ScrollReveal();

  // Console
  showConsoleWelcome();
});
