const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

// Navigation toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('active', open);
  navToggle.classList.toggle('active', open);
  navToggle.setAttribute('aria-expanded', String(open));
}

navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('active')));

// Close mobile menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('active')) {
    setMenu(false);
    navToggle.focus();
  }
});

// Header shadow after scrolling
const header = document.getElementById('header');
let ticking = false;

window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    header.classList.toggle('is-scrolled', window.pageYOffset > 8);
    ticking = false;
  });
}, { passive: true });

// Highlight the nav link of the section in view
const linkById = new Map();
navLinks.querySelectorAll('a[href^="#"]').forEach(a => linkById.set(a.getAttribute('href').slice(1), a));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    linkById.forEach((a, id) => {
      if (id === entry.target.id) a.setAttribute('aria-current', 'true');
      else a.removeAttribute('aria-current');
    });
  });
}, { rootMargin: '-45% 0px -50% 0px' });

linkById.forEach((a, id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

// Project filtering
const filterButtons = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
let filterRun = 0;

function applyFilter(filter) {
  const run = ++filterRun;
  const matches = (card) => filter === 'all' || card.dataset.category.split(' ').includes(filter);
  const leaving = [];
  const entering = [];

  projectCards.forEach(card => {
    const show = matches(card);
    const visible = !card.classList.contains('hidden');
    if (!show && visible) leaving.push(card);
    if (show && !visible) entering.push(card);
  });

  const reveal = () => {
    if (run !== filterRun) return;
    leaving.forEach(card => {
      card.classList.add('hidden');
      card.classList.remove('is-leaving');
    });
    entering.forEach((card, i) => {
      card.classList.remove('hidden', 'is-leaving');
      card.classList.remove('is-entering');
      card.style.animationDelay = `${i * 70}ms`;
      void card.offsetWidth;
      card.classList.add('is-entering');
    });
  };

  if (reducedMotion.matches || leaving.length === 0) {
    reveal();
    return;
  }
  leaving.forEach(card => card.classList.add('is-leaving'));
  setTimeout(reveal, 240);
}

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    applyFilter(btn.dataset.filter);
  });
});

projectCards.forEach(card => {
  card.addEventListener('animationend', () => {
    card.classList.remove('is-entering');
    card.style.animationDelay = '';
  });
});

// Reveal on scroll
const revealItems = document.querySelectorAll('[data-reveal]');

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach(el => revealObserver.observe(el));
} else {
  revealItems.forEach(el => el.classList.add('is-in'));
}

// Form submission
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;

  submitBtn.textContent = 'Sending...';
  submitBtn.disabled = true;
  submitBtn.setAttribute('aria-busy', 'true');

  // Simulate form submission (replace with actual endpoint)
  await new Promise(resolve => setTimeout(resolve, 1500));

  submitBtn.textContent = 'Sent!';
  submitBtn.removeAttribute('aria-busy');
  formStatus.textContent = 'Demo only: this form is not connected to an inbox yet. Nothing was sent.';

  setTimeout(() => {
    submitBtn.textContent = originalText;
    submitBtn.disabled = false;
    contactForm.reset();
  }, 2000);
});
