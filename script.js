document.addEventListener('DOMContentLoaded', () => {
  // Year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // GSAP + ScrollTrigger
  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Lenis
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Loader animation
  (function loaderAnimation(){
    const loader = document.getElementById('loader');
    const path = document.getElementById('emblem-path');
    const fill = document.getElementById('emblem-fill');
    if (!loader || !path || !fill || !window.gsap) {
      if (loader) loader.style.display = 'none';
      return;
    }
    const total = path.getTotalLength();
    path.style.strokeDasharray = total;
    path.style.strokeDashoffset = total;

    const tl = gsap.timeline({
      defaults: { ease: 'power2.out' },
      onComplete: () => {
        gsap.to('#loader', { autoAlpha: 0, duration: 0.6, onComplete: () => {
          loader.style.display = 'none';
        }});
      }
    });

    tl.to('#loader', { opacity: 1, duration: 0.2 })
      .to(path, { strokeDashoffset: 0, duration: 1.4 }, 0.2)
      .to(fill, { attr: { r: 62 }, opacity: 0.18, duration: 0.9 }, 0.6)
      .to('#loader-emblem', { scale: 1.06, transformOrigin: '50% 50%', yoyo: true, repeat: 1, duration: 0.6 }, 0.9)
      .to('#loader', { opacity: 0, duration: 0.5, delay: 0.2 });
  })();

  // Hero word-by-word
  (function heroWords(){
    if (!window.gsap) return;
    const words = document.querySelectorAll('.hero-word');
    gsap.set(words, { opacity: 0, y: 20 });
    gsap.to(words, {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.4
    });
  })();

  // Scroll reveal
  (function scrollReveals(){
    if (!window.gsap || !window.ScrollTrigger) return;
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });
  })();

  // Button hover lift
  (function buttonHovers() {
    if (!window.gsap) return;
    ['.btn-primary', '.btn-cta', '.btn-ghost'].forEach(selector => {
      document.querySelectorAll(selector).forEach(btn => {
        let hover = gsap.to(btn, { y: -2, duration: 0.18, paused: true, ease: 'power2.out' });
        btn.addEventListener('mouseenter', () => hover.play());
        btn.addEventListener('mouseleave', () => hover.reverse());
      });
    });
  })();

  // Modal helpers
  function openModal(id){
    const modal = document.getElementById(id);
    if(!modal) return;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('overflow-hidden');
    if (window.gsap) {
      const content = modal.querySelector('.modal-content');
      if (content) {
        gsap.fromTo(content,
          { opacity: 0, y: 20, scale: 0.98 },
          { opacity: 1, y: 0, scale: 1, duration: 0.3, ease: 'power2.out' }
        );
      }
    }
  }
  function closeModal(id){
    const modal = document.getElementById(id);
    if(!modal) return;
    const content = modal.querySelector('.modal-content');
    const finish = () => {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('overflow-hidden');
    };
    if (window.gsap && content) {
      gsap.to(content, {
        opacity: 0, y: 14, scale: 0.98, duration: 0.2, ease: 'power2.in',
        onComplete: finish
      });
    } else {
      finish();
    }
  }

  // Resume modal
  const openResumeBtn = document.getElementById('openResume');
  if (openResumeBtn) openResumeBtn.addEventListener('click', () => openModal('resumeModal'));

  // Old gallery button (if present)
  const openCertBtn = document.getElementById('openCertificates');
  if (openCertBtn) openCertBtn.addEventListener('click', () => openModal('certModal'));

  // Per-item certificate buttons
  document.querySelectorAll('[data-cert-target]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-cert-target');
      if (targetId) openModal(targetId);
    });
  });

  // Close controls
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.currentTarget.getAttribute('data-close');
      if (id) closeModal(id);
    });
  });
  document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if(e.target.classList.contains('modal-backdrop')) {
        closeModal(modal.id);
      }
    });
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal').forEach(modal => {
        if (!modal.classList.contains('hidden')) closeModal(modal.id);
      });
    }
  });

  // Optional resume stub (remove when real PDF is ready)
  const resumeFrame = document.querySelector('#resumeModal iframe');
  if (resumeFrame && !resumeFrame.src || resumeFrame.src === 'about:blank') {
    const pdfData = 'data:application/pdf;base64,';
    const blankPdfBase64 = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlcy9LaWRzIFszIDAgUl0vQ291bnQgMT4+CmVuZG9iagozIDAgb2JqCjw8L1R5cGUvUGFnZS9NZWRpYUJveFswIDAgNTk1IDg0Ml0vUGFyZW50IDIgMCBSL1Jlc291cmNlczw8Pj4vQ29udGVudHMgNCAwIFI+PgplbmRvYmoKNCAwIG9iago8PC9MZW5ndGggMTI+PgpzdHJlYW0Kc1IKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAxMTQgMDAwMDAgbiAKMDAwMDAwMDA3MCAwMDAwMCBuIAowMDAwMDAwMTk4IDAwMDAwIG4gCjAwMDAwMDAyOTMgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDUvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgozOTUKJSVFT0Y=';
    resumeFrame.src = pdfData + blankPdfBase64;
  }

  // Smooth internal anchors
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const href = a.getAttribute('href');
      if(href && href.length > 1){
        e.preventDefault();
        const target = document.querySelector(href);
        if(target){
          const top = target.getBoundingClientRect().top + window.scrollY - 76;
          if (lenis) {
            lenis.scrollTo(top, { offset: 0 });
          } else {
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      }
    });
  });
});
