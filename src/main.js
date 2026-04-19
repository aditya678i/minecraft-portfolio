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

  // Work items FLIP helper
  const workItems = Array.from(document.querySelectorAll('.work-item'));

  const applyFLIP = (actionCallback) => {
    // 1. FIRST: measure initial positions (we measure center X and top Y)
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
                // Ensure transform animation matches the CSS frame expansion timing
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
                playClickSound(); // Add sound feedback for expanding
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
