(function () {
  const start = () => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(pointer: fine)').matches;

    document.documentElement.classList.add('gallery-premium-ready');

    const tiltTargets = document.querySelectorAll('.gallery-card, .coming-soon-wrap, .gal-info-card, .cta-box');
    tiltTargets.forEach((target) => target.classList.add('premium-tilt'));

    if (!reduceMotion && finePointer) {
      tiltTargets.forEach((target) => {
        const maxTilt = target.classList.contains('gallery-card') ? 5 : 4;

        target.addEventListener('pointermove', (event) => {
          const rect = target.getBoundingClientRect();
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;

          target.style.transform = `perspective(1200px) rotateX(${(-relY * maxTilt).toFixed(2)}deg) rotateY(${(relX * maxTilt).toFixed(2)}deg) translateY(-4px)`;
        });

        target.addEventListener('pointerleave', () => {
          target.style.transform = '';
        });
      });

      document.querySelectorAll('.premium-stage').forEach((stage) => {
        const image = stage.querySelector('.main-slide-img');
        if (!image) return;

        stage.addEventListener('pointermove', (event) => {
          const rect = stage.getBoundingClientRect();
          const relX = (event.clientX - rect.left) / rect.width - 0.5;
          const relY = (event.clientY - rect.top) / rect.height - 0.5;
          image.style.transform = `translate3d(${(relX * 14).toFixed(1)}px, ${(relY * 8).toFixed(1)}px, 46px) scale(1.045)`;
        });

        stage.addEventListener('pointerleave', () => {
          image.style.transform = '';
        });
      });
    }

    document.querySelectorAll('.proj-pill').forEach((button) => {
      button.addEventListener('click', () => {
        const panel = document.getElementById(`panel-${button.dataset.tab}`);
        if (!panel) return;

        panel.classList.remove('panel-pop');
        requestAnimationFrame(() => panel.classList.add('panel-pop'));
      });
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
