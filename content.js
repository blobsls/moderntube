// Main Enhancement Class
class ModernYouTube {
  constructor() {
    this.init();
  }

  init() {
    this.injectGSAP();
    this.setupTheme();
    this.addFloatingProgress();
    this.addThemeToggle();
    this.addMinimalistToggle();
    this.enhancePlayerControls();
    this.setupCustomThemes();
    this.addLoadingAnimations();
    this.observePageChanges();
  }

  injectGSAP() {
    if (!window.MODERN_YT_GSAP_LOADED) {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.11.4/gsap.min.js';
      script.onload = () => {
        window.MODERN_YT_GSAP_LOADED = true;
        this.setupAnimations();
      };
      document.head.appendChild(script);
    } else {
      this.setupAnimations();
    }
  }

  setupTheme() {
    const savedTheme = localStorage.getItem('modernYTTheme') || 
                      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.classList.add(`modern-${savedTheme}`);
  }

  addFloatingProgress() {
    const progressBar = document.createElement('div');
    progressBar.id = 'modern-floating-progress';
    progressBar.innerHTML = '<div class="fill"></div>';
    document.body.appendChild(progressBar);

    document.addEventListener('mousemove', (e) => {
      if (e.clientY > window.innerHeight - 100) return;
      const progress = document.querySelector('#modern-floating-progress');
      progress.style.display = 'block';
      clearTimeout(this.progressHideTimeout);
      this.progressHideTimeout = setTimeout(() => {
        progress.style.display = 'none';
      }, 2000);
    });

    const observer = new MutationObserver(() => {
      const video = document.querySelector('video');
      if (video) {
        video.addEventListener('timeupdate', () => {
          const progress = document.querySelector('#modern-floating-progress .fill');
          if (progress) {
            progress.style.width = `${(video.currentTime / video.duration) * 100}%`;
          }
        });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }

  addThemeToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'modern-theme-toggle';
    toggle.innerHTML = '🌓';
    toggle.title = 'Toggle Dark/Light Mode';
    
    toggle.addEventListener('click', () => {
      const isDark = document.documentElement.classList.contains('modern-dark');
      document.documentElement.classList.toggle('modern-dark', !isDark);
      document.documentElement.classList.toggle('modern-light', isDark);
      localStorage.setItem('modernYTTheme', isDark ? 'light' : 'dark');
      toggle.innerHTML = isDark ? '🌞' : '🌙';
    });
    
    document.body.appendChild(toggle);
  }

  addMinimalistToggle() {
    const toggle = document.createElement('div');
    toggle.className = 'modern-minimalist-toggle';
    toggle.innerHTML = '🧘';
    toggle.title = 'Toggle Minimalist Mode';
    toggle.style.position = 'fixed';
    toggle.style.bottom = '120px';
    toggle.style.right = '20px';
    toggle.style.zIndex = '1000';
    toggle.style.background = 'var(--modern-bg-secondary)';
    toggle.style.borderRadius = '50%';
    toggle.style.width = '40px';
    toggle.style.height = '40px';
    toggle.style.display = 'flex';
    toggle.style.alignItems = 'center';
    toggle.style.justifyContent = 'center';
    toggle.style.cursor = 'pointer';
    toggle.style.boxShadow = 'var(--modern-shadow)';
    toggle.style.transition = 'var(--modern-transition)';
    
    toggle.addEventListener('click', () => {
      document.documentElement.classList.toggle('modern-minimalist');
      localStorage.setItem('modernYTMinimalist', 
        document.documentElement.classList.contains('modern-minimalist'));
      toggle.innerHTML = document.documentElement.classList.contains('modern-minimalist') ? '🧘‍♂️' : '🧘';
    });
    
    if (localStorage.getItem('modernYTMinimalist') === 'true') {
      document.documentElement.classList.add('modern-minimalist');
      toggle.innerHTML = '🧘‍♂️';
    }
    
    document.body.appendChild(toggle);
  }

  enhancePlayerControls() {
    const enhanceControls = () => {
      const controls = document.querySelector('.ytp-chrome-bottom');
      if (controls) {
        // Add smooth volume control
        const volume = document.querySelector('.ytp-volume-area');
        if (volume) {
          volume.addEventListener('wheel', (e) => {
            e.preventDefault();
            const video = document.querySelector('video');
            if (video) {
              const delta = e.deltaY > 0 ? -0.05 : 0.05;
              video.volume = Math.min(1, Math.max(0, video.volume + delta));
            }
          });
        }
        
        // Enhance speed control
        const speed = document.querySelector('.ytp-speed-button');
        if (speed) {
          speed.style.transition = 'var(--modern-transition)';
          speed.addEventListener('mouseenter', () => {
            speed.style.transform = 'scale(1.1)';
          });
          speed.addEventListener('mouseleave', () => {
            speed.style.transform = 'scale(1)';
          });
        }
      }
    };
    
    // Run now and whenever player changes
    enhanceControls();
    const observer = new MutationObserver(enhanceControls);
    observer.observe(document.body, { childList: true, subtree: true });
  }

  setupCustomThemes() {
    const themes = {
      'default': {},
      'ocean': {
        '--modern-primary': '#1a73e8',
        '--modern-primary-hover': '#4285f4',
        '--modern-bg-primary': '#0d1117',
        '--modern-bg-secondary': '#161b22'
      },
      'forest': {
        '--modern-primary': '#0b8043',
        '--modern-primary-hover': '#0f9d58',
        '--modern-bg-primary': '#0d1f12',
        '--modern-bg-secondary': '#142a1a'
      },
      'sunset': {
        '--modern-primary': '#e67c73',
        '--modern-primary-hover': '#e57373',
        '--modern-bg-primary': '#1a1a2e',
        '--modern-bg-secondary': '#16213e'
      }
    };
    
    const savedTheme = localStorage.getItem('modernYTColorTheme') || 'default';
    this.applyTheme(themes[savedTheme]);
    
    // Add theme selector to page
    this.addThemeSelector(themes);
  }

  applyTheme(theme) {
    const root = document.documentElement;
    Object.entries(theme).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }

  addThemeSelector(themes) {
    const container = document.createElement('div');
    container.id = 'modern-theme-selector';
    container.style.position = 'fixed';
    container.style.bottom = '160px';
    container.style.right = '20px';
    container.style.zIndex = '1000';
    container.style.background = 'var(--modern-bg-secondary)';
    container.style.padding = '10px';
    container.style.borderRadius = '8px';
    container.style.boxShadow = 'var(--modern-shadow)';
    
    const title = document.createElement('div');
    title.textContent = 'Theme';
    title.style.marginBottom = '8px';
    title.style.fontWeight = 'bold';
    container.appendChild(title);
    
    Object.keys(themes).forEach(theme => {
      const btn = document.createElement('button');
      btn.textContent = theme.charAt(0).toUpperCase() + theme.slice(1);
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.margin = '4px 0';
      btn.style.padding = '6px 12px';
      btn.style.borderRadius = '4px';
      btn.style.border = 'none';
      btn.style.background = 'var(--modern-primary)';
      btn.style.color = 'white';
      btn.style.cursor = 'pointer';
      btn.style.transition = 'var(--modern-transition)';
      
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'translateX(-2px)';
      });
      
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translateX(0)';
      });
      
      btn.addEventListener('click', () => {
        this.applyTheme(themes[theme]);
        localStorage.setItem('modernYTColorTheme', theme);
      });
      
      container.appendChild(btn);
    });
    
    document.body.appendChild(container);
    
    // Toggle visibility on theme button click
    const themeBtn = document.createElement('div');
    themeBtn.className = 'modern-theme-btn';
    themeBtn.innerHTML = '🎨';
    themeBtn.title = 'Change Theme';
    themeBtn.style.position = 'fixed';
    themeBtn.style.bottom = '160px';
    themeBtn.style.right = '20px';
    themeBtn.style.zIndex = '1000';
    themeBtn.style.background = 'var(--modern-bg-secondary)';
    themeBtn.style.borderRadius = '50%';
    themeBtn.style.width = '40px';
    themeBtn.style.height = '40px';
    themeBtn.style.display = 'flex';
    themeBtn.style.alignItems = 'center';
    themeBtn.style.justifyContent = 'center';
    themeBtn.style.cursor = 'pointer';
    themeBtn.style.boxShadow = 'var(--modern-shadow)';
    themeBtn.style.transition = 'var(--modern-transition)';
    
    container.style.display = 'none';
    
    themeBtn.addEventListener('click', () => {
      container.style.display = container.style.display === 'none' ? 'block' : 'none';
    });
    
    document.body.appendChild(themeBtn);
  }

  addLoadingAnimations() {
    // Add shimmer effect to thumbnails while loading
    const addShimmer = () => {
      document.querySelectorAll('ytd-thumbnail:not(.processed)').forEach(thumb => {
        thumb.classList.add('processed');
        if (!thumb.querySelector('img[src]')) {
          thumb.classList.add('modern-loading');
          
          const observer = new MutationObserver((mutations) => {
            if (thumb.querySelector('img[src]')) {
              thumb.classList.remove('modern-loading');
              observer.disconnect();
            }
          });
          
          observer.observe(thumb, { childList: true, subtree: true });
        }
      });
    };
    
    addShimmer();
    setInterval(addShimmer, 1000);
  }

  setupAnimations() {
    if (!window.MODERN_YT_GSAP_LOADED) return;
    
    // Page transition animation
    const animatePageIn = () => {
      gsap.from('#page-manager', {
        duration: 0.5,
        opacity: 0,
        y: 20,
        ease: 'power2.out'
      });
    };
    
    // Run on initial load
    animatePageIn();
    
    // Run on navigation
    document.addEventListener('yt-navigate-finish', animatePageIn);
    
    // Video card hover animations
    document.querySelectorAll('ytd-rich-item-renderer').forEach(card => {
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          duration: 0.3,
          y: -5,
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          duration: 0.3,
          y: 0,
          boxShadow: 'none',
          ease: 'power2.out'
        });
      });
    });
  }

  observePageChanges() {
    const observer = new MutationObserver(() => {
      this.setupAnimations();
      this.enhancePlayerControls();
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
  }
}

// Initialize when page is ready
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  new ModernYouTube();
} else {
  document.addEventListener('DOMContentLoaded', () => new ModernYouTube());
}

// Also initialize on YouTube's navigation events
document.addEventListener('yt-navigate-finish', () => {
  setTimeout(() => new ModernYouTube(), 500);
});
