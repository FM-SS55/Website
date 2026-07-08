// public/js/main.js
// Public site interactivity: mobile nav toggle + hero banner auto-slider.
// No frameworks — plain DOM APIs only.

document.addEventListener('DOMContentLoaded', () => {
  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // ---- Hero banner slider ----
  const slides = document.querySelectorAll('.hero__slide');
  const dotsWrap = document.getElementById('heroDots');
  if (slides.length > 1) {
    let current = 0;
    const dots = [];

    // Build one dot button per slide
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      if (i === 0) dot.classList.add('is-active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
      dots.push(dot);
    });

    function goTo(index) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = index;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }

    setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 6000);
  }
});