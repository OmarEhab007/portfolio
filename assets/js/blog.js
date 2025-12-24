/**
 * OMAR.DEV - Blog System
 * Markdown-powered blog with client-side rendering
 */

'use strict';

// ============================================
// BLOG MANAGER
// ============================================

class BlogManager {
  constructor() {
    this.blogsData = null;
    this.currentPost = null;
    this.basePath = './blogs/';
    
    // DOM Elements
    this.blogListSection = document.getElementById('blog-list');
    this.blogPostSection = document.getElementById('blog-post');
    this.blogEntries = document.getElementById('blog-entries');
    this.postTitle = document.getElementById('post-title');
    this.postDate = document.getElementById('post-date');
    this.postTags = document.getElementById('post-tags');
    this.postContent = document.getElementById('post-content');
    this.tagsCloud = document.getElementById('tags-cloud');
    this.recentPosts = document.getElementById('recent-posts');
    
    // Configure marked.js
    this.configureMarked();
    
    // Initialize
    this.init();
  }
  
  configureMarked() {
    // Custom renderer for code blocks
    const renderer = new marked.Renderer();
    
    // Add language label to code blocks (marked.js v5+ passes object)
    renderer.code = (codeObj) => {
      // Handle both old and new marked.js API
      const code = typeof codeObj === 'string' ? codeObj : (codeObj.text || codeObj.raw || '');
      const lang = (typeof codeObj === 'object' ? codeObj.lang : arguments[1]) || 'plaintext';
      
      let highlighted;
      
      try {
        if (hljs.getLanguage(lang)) {
          highlighted = hljs.highlight(code, { language: lang }).value;
        } else {
          highlighted = hljs.highlightAuto(code).value;
        }
      } catch (e) {
        highlighted = this.escapeHtml(code);
      }
      
      return `<pre data-lang="${lang}"><code class="hljs language-${lang}">${highlighted}</code></pre>`;
    };
    
    // External links open in new tab (marked.js v5+ passes object)
    renderer.link = (linkObj) => {
      // Handle both old and new marked.js API
      const href = typeof linkObj === 'string' ? linkObj : (linkObj.href || '');
      const title = typeof linkObj === 'object' ? linkObj.title : arguments[1];
      const text = typeof linkObj === 'object' ? linkObj.text : arguments[2];
      
      const isExternal = href.startsWith('http');
      const target = isExternal ? ' target="_blank" rel="noopener noreferrer"' : '';
      const titleAttr = title ? ` title="${title}"` : '';
      return `<a href="${href}"${titleAttr}${target}>${text}</a>`;
    };
    
    marked.setOptions({
      renderer: renderer,
      gfm: true,
      breaks: false,
      pedantic: false,
      smartLists: true,
      smartypants: true
    });
  }
  
  async init() {
    try {
      // Load blog index
      await this.loadBlogsIndex();
      
      // Check URL for post ID
      const postId = this.getPostIdFromUrl();
      
      if (postId) {
        // Show single post
        await this.showPost(postId);
      } else {
        // Show blog list
        this.showBlogList();
      }
      
      // Populate sidebar
      this.populateSidebar();
      
      // Setup share buttons
      this.setupShareButtons();
      
      // Handle browser back/forward
      window.addEventListener('popstate', () => this.handleNavigation());
      
    } catch (error) {
      console.error('Failed to initialize blog:', error);
      this.showError('Failed to load blog posts. Please try again later.');
    }
  }
  
  async loadBlogsIndex() {
    const response = await fetch(`${this.basePath}index.json`);
    if (!response.ok) {
      throw new Error('Failed to load blog index');
    }
    this.blogsData = await response.json();
  }
  
  getPostIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('post');
  }
  
  handleNavigation() {
    const postId = this.getPostIdFromUrl();
    if (postId) {
      this.showPost(postId);
    } else {
      this.showBlogList();
    }
  }
  
  // ============================================
  // BLOG LIST VIEW
  // ============================================
  
  showBlogList() {
    // Update page title
    document.title = 'Blog - OMAR.DEV';
    
    // Show list, hide post
    this.blogListSection.style.display = 'block';
    this.blogPostSection.style.display = 'none';
    
    // Render blog entries
    this.renderBlogEntries();
  }
  
  renderBlogEntries() {
    if (!this.blogsData || !this.blogsData.blogs.length) {
      this.blogEntries.innerHTML = `
        <div class="no-posts">
          <h3>No posts yet</h3>
          <p>Check back soon for new content!</p>
        </div>
      `;
      return;
    }
    
    const html = this.blogsData.blogs.map(blog => `
      <article class="blog-entry">
        <h2 class="blog-entry-title">
          <a href="blog.html?post=${blog.id}">${this.escapeHtml(blog.title)}</a>
        </h2>
        <div class="blog-entry-meta">
          <span class="blog-entry-date">${blog.dateFormatted}</span>
          <div class="blog-entry-tags">
            ${blog.tags.map(tag => `
              <a href="blog.html?tag=${tag}" class="blog-tag">#${tag}</a>
            `).join('')}
          </div>
        </div>
        <p class="blog-entry-description">${this.escapeHtml(blog.description)}</p>
        <a href="blog.html?post=${blog.id}" class="blog-entry-link">Read more →</a>
      </article>
    `).join('');
    
    this.blogEntries.innerHTML = html;
    
    // Add click handlers for internal navigation
    this.blogEntries.querySelectorAll('a[href^="blog.html?post="]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const postId = new URL(link.href).searchParams.get('post');
        history.pushState({}, '', `blog.html?post=${postId}`);
        this.showPost(postId);
      });
    });
  }
  
  // ============================================
  // SINGLE POST VIEW
  // ============================================
  
  async showPost(postId) {
    // Find post metadata
    const post = this.blogsData.blogs.find(b => b.id === postId);
    
    if (!post) {
      this.showError('Post not found');
      return;
    }
    
    this.currentPost = post;
    
    // Update page title
    document.title = `${post.title} - OMAR.DEV`;
    
    // Show loading state
    this.postContent.innerHTML = `
      <div class="loading-spinner">
        <span class="spinner"></span> Loading post...
      </div>
    `;
    
    // Show post section, hide list
    this.blogListSection.style.display = 'none';
    this.blogPostSection.style.display = 'block';
    
    // Set header content
    this.postTitle.textContent = post.title;
    this.postDate.textContent = post.dateFormatted;
    this.postTags.innerHTML = post.tags.map(tag => 
      `<a href="blog.html?tag=${tag}" class="blog-tag">#${tag}</a>`
    ).join('');
    
    try {
      // Fetch and render markdown
      const response = await fetch(`${this.basePath}${post.file}`);
      if (!response.ok) {
        throw new Error('Failed to load post content');
      }
      
      const markdown = await response.text();
      const html = marked.parse(markdown);
      
      this.postContent.innerHTML = html;
      
      // Re-highlight code blocks (in case marked didn't catch all)
      this.postContent.querySelectorAll('pre code').forEach(block => {
        hljs.highlightElement(block);
      });
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Update share links
      this.updateShareLinks(post);
      
    } catch (error) {
      console.error('Failed to load post:', error);
      this.postContent.innerHTML = `
        <div class="no-posts">
          <h3>Error loading post</h3>
          <p>Failed to load the blog post. Please try again later.</p>
        </div>
      `;
    }
  }
  
  // ============================================
  // SIDEBAR
  // ============================================
  
  populateSidebar() {
    // Tags cloud
    if (this.tagsCloud && this.blogsData) {
      const allTags = new Set();
      this.blogsData.blogs.forEach(blog => {
        blog.tags.forEach(tag => allTags.add(tag));
      });
      
      this.tagsCloud.innerHTML = Array.from(allTags).map(tag =>
        `<a href="blog.html?tag=${tag}" class="blog-tag">#${tag}</a>`
      ).join('');
    }
    
    // Recent posts
    if (this.recentPosts && this.blogsData) {
      const recent = this.blogsData.blogs.slice(0, 5);
      
      this.recentPosts.innerHTML = recent.map(blog => `
        <li>
          <a href="blog.html?post=${blog.id}">
            ${this.escapeHtml(blog.title)}
            <span class="recent-post-date">${blog.dateFormatted}</span>
          </a>
        </li>
      `).join('');
      
      // Add click handlers
      this.recentPosts.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const postId = new URL(link.href).searchParams.get('post');
          history.pushState({}, '', `blog.html?post=${postId}`);
          this.showPost(postId);
        });
      });
    }
  }
  
  // ============================================
  // SHARE FUNCTIONALITY
  // ============================================
  
  setupShareButtons() {
    const copyBtn = document.getElementById('copy-link');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyLink());
    }
  }
  
  updateShareLinks(post) {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(post.title);
    
    const twitterLink = document.getElementById('share-twitter');
    const linkedinLink = document.getElementById('share-linkedin');
    
    if (twitterLink) {
      twitterLink.href = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
    }
    
    if (linkedinLink) {
      linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    }
  }
  
  copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.showNotification('Link copied to clipboard!');
    }).catch(() => {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      this.showNotification('Link copied to clipboard!');
    });
  }
  
  // ============================================
  // UTILITIES
  // ============================================
  
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  showError(message) {
    this.blogListSection.style.display = 'block';
    this.blogPostSection.style.display = 'none';
    
    this.blogEntries.innerHTML = `
      <div class="no-posts">
        <h3>Oops!</h3>
        <p>${this.escapeHtml(message)}</p>
        <a href="blog.html" style="color: var(--text-cyan);">← Back to blog</a>
      </div>
    `;
  }
  
  showNotification(message) {
    const notif = document.createElement('div');
    notif.className = 'copy-notification';
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
// INITIALIZE
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  new BlogManager();
});

