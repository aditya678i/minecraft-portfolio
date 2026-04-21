/**
 * Minecraft Portfolio - Logic
 */

// Section Reveal Logic
const setupObserver = () => {
  const options = {
    rootMargin: '-20% 0px -20% 0px',
    threshold: 0.2
  };

  const sections = document.querySelectorAll('.section:not(#footer)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        
        // Navigation highlight logic can go here if needed
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, options);

  sections.forEach(section => {
    observer.observe(section);
  });
};

const playClickSound = () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
    
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.1);
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const loader = document.getElementById('mc-loader');
  const fill = document.getElementById('loading-fill');
  const percentText = document.getElementById('loading-percent');
  const bgVideo = document.getElementById('bg-video');

  // Handle Title Typography (Split into spans for animation)
  document.querySelectorAll('section h1').forEach(h1 => {
    const text = h1.innerText;
    h1.innerHTML = '';
    [...text].forEach((letter, i) => {
      const span = document.createElement('span');
      span.innerText = letter === ' ' ? '\u00A0' : letter;
      span.style.setProperty('--index', i);
      h1.appendChild(span);
    });
  });

  let currentPercent = 0;
  let targetPercent = 0;
  let hideTriggered = false;

  // Smooth fake progress animation
  const animateProgress = () => {
    if (currentPercent < targetPercent) {
      currentPercent = Math.min(currentPercent + 1, targetPercent);
      fill.style.width = currentPercent + '%';
      percentText.textContent = currentPercent + '%';
    }
    if (currentPercent < 100) {
      requestAnimationFrame(animateProgress);
    }
  };
  requestAnimationFrame(animateProgress);

  // Fake progress: crawl to 80% while video loads
  const crawl = setInterval(() => {
    if (targetPercent < 80) {
      targetPercent = Math.min(targetPercent + Math.random() * 5, 80);
    } else {
      clearInterval(crawl);
    }
  }, 200);

  const revealSite = () => {
    if (hideTriggered) return;
    hideTriggered = true;

    clearInterval(crawl);
    targetPercent = 100;
    currentPercent = Math.max(currentPercent, 95);

    // Ensure bar reaches 100 before hiding
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 800);
    }, 600);

    // Force video play (critical for mobile)
    bgVideo.muted = true;
    bgVideo.play().catch(() => {
      // Autoplay blocked — add tap-to-start listener
      document.addEventListener('touchstart', () => bgVideo.play(), { once: true });
      document.addEventListener('click', () => bgVideo.play(), { once: true });
    });
  };

  // Listen for video ready events
  if (bgVideo.readyState >= 3) {
    // Already loaded (from cache)
    revealSite();
  } else {
    bgVideo.addEventListener('canplaythrough', revealSite, { once: true });
    bgVideo.addEventListener('canplay', revealSite, { once: true });
  }

  // Hard fallback: always reveal after 10 seconds no matter what
  setTimeout(revealSite, 10000);

  setupObserver();
  
  // Custom Crosshair Click Sound
  document.querySelectorAll('.mc-button').forEach(btn => {
    btn.addEventListener('click', (e) => {
        playClickSound();
    });
  });

  // Start Button -> Physical Works
  const startBtn = document.getElementById('start-btn');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
        const target = document.getElementById('physical-works');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
  }

  // See Work -> Toggle Pop-up
  const toggleWorkBtn = document.getElementById('toggle-work-btn');
  const workContainer = document.getElementById('work-popup-container');
  if (toggleWorkBtn && workContainer) {
    toggleWorkBtn.addEventListener('click', () => {
        const isVisible = workContainer.classList.toggle('visible');
        toggleWorkBtn.textContent = isVisible ? 'Close Inventory' : 'See Work';
        
        // Bonus sound effect
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(isVisible ? 300 : 200, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);

        // Collapse all items when toggling container just in case
        if (!isVisible) {
            document.querySelectorAll('.work-item').forEach(item => item.classList.remove('expanded'));
        }
    });
  }

  // Composition -> Toggle Pop-up
  const toggleCompBtn = document.getElementById('toggle-comp-btn');
  const compContainer = document.getElementById('comp-popup-container');
  if (toggleCompBtn && compContainer) {
    toggleCompBtn.addEventListener('click', () => {
        const isVisible = compContainer.classList.toggle('visible');
        toggleCompBtn.textContent = isVisible ? 'Close Inventory' : 'My Work';
        
        // Bonus sound effect
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(isVisible ? 300 : 200, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);

        // Collapse all items when toggling container just in case
        if (!isVisible) {
            compContainer.querySelectorAll('.work-item').forEach(item => item.classList.remove('expanded'));
        }
    });
  }

  // Projects -> Toggle Pop-up
  const toggleProdBtn = document.getElementById('toggle-prod-btn');
  const prodContainer = document.getElementById('prod-popup-container');
  if (toggleProdBtn && prodContainer) {
    toggleProdBtn.addEventListener('click', () => {
        const isVisible = prodContainer.classList.toggle('visible');
        toggleProdBtn.textContent = isVisible ? 'Close Collection' : 'View Collection';
        
        // Bonus sound effect
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        osc.frequency.setValueAtTime(isVisible ? 300 : 200, audioCtx.currentTime);
        osc.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.05);

        // Collapse all items when toggling container just in case
        if (!isVisible) {
            prodContainer.querySelectorAll('.work-item').forEach(item => item.classList.remove('expanded'));
        }
    });
  }

  // Work items FLIP helper
  const workItems = Array.from(document.querySelectorAll('.work-item'));

  const applyFLIP = (actionCallback) => {
    // 1. FIRST: measure initial positions
    const firstRects = workItems.map(item => {
        const r = item.getBoundingClientRect();
        return { cx: r.left + r.width / 2, y: r.top };
    });

    // 2. DOM UPDATE
    actionCallback();

    // 3. LAST: measure new positions
    const lastRects = workItems.map(item => {
        const r = item.getBoundingClientRect();
        return { cx: r.left + r.width / 2, y: r.top };
    });

    // 4. INVERT
    workItems.forEach((item, i) => {
        const first = firstRects[i];
        const last = lastRects[i];
        const deltaX = first.cx - last.cx;
        const deltaY = first.y - last.y;

        item.style.transition = 'transform 0s';
        item.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
    });

    // 5. PLAY
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            workItems.forEach(item => {
                item.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.transform = 'translate(0, 0)';
                
                setTimeout(() => {
                    item.style.transition = '';
                    item.style.transform = '';
                }, 500);
            });
        });
    });
  };

  // Work items expansion logic
  workItems.forEach(item => {
    item.addEventListener('click', () => {
        const isExpanded = item.classList.contains('expanded');
        
        applyFLIP(() => {
            // Collapse all others
            workItems.forEach(other => {
                other.classList.remove('expanded');
            });

            if (!isExpanded) {
                item.classList.add('expanded');
                playClickSound();

                // Fire scroll 100ms after reorder so the layout has definitely settled
                setTimeout(() => {
                    const windowTarget = item.closest('.mc-window');
                    if (windowTarget) {
                        const rect = windowTarget.getBoundingClientRect();
                        const absoluteTop = rect.top + window.scrollY;
                        // Scroll to the top of the window with a small offset
                        window.scrollTo({ top: absoluteTop - 40, behavior: 'smooth' });
                    }
                }, 100);
            } else {
                // Sound for collapsing
                const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
                const osc = audioCtx.createOscillator();
                osc.frequency.setValueAtTime(100, audioCtx.currentTime);
                osc.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.05);
            }
        });
    });
  });
});
