const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

function setMenu(open) {
  navLinks.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

navToggle.addEventListener('click', () => setMenu(!navLinks.classList.contains('is-open')));
navLinks.addEventListener('click', (e) => {
  if (e.target.closest('a')) setMenu(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
    setMenu(false);
    navToggle.focus();
  }
});

const navTape = document.getElementById('navTape');
let ticking = false;

function updateTape() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  navTape.style.setProperty('--progress', max > 0 ? window.scrollY / max : 0);
  ticking = false;
}
window.addEventListener('scroll', () => {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateTape);
}, { passive: true });
updateTape();

const linkById = new Map();
navLinks.querySelectorAll('a[href^="#"]').forEach((a) => linkById.set(a.getAttribute('href').slice(1), a));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const link = linkById.get(entry.target.id);
    if (entry.isIntersecting) link.setAttribute('aria-current', 'true');
    else link.removeAttribute('aria-current');
  });
}, { rootMargin: '-45% 0px -50% 0px' });
linkById.forEach((_, id) => {
  const section = document.getElementById(id);
  if (section) sectionObserver.observe(section);
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });
document.querySelectorAll('[data-reveal]').forEach((el) => revealObserver.observe(el));

const copyEmail = document.getElementById('copyEmail');
const copyStatus = document.getElementById('copyStatus');

copyEmail.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyEmail.dataset.email);
    copyEmail.textContent = 'Copied';
    copyStatus.textContent = 'Email address copied.';
    setTimeout(() => {
      copyEmail.textContent = 'Copy';
      copyStatus.textContent = '';
    }, 2500);
  } catch {
    copyStatus.textContent = `Copy failed. The address is ${copyEmail.dataset.email}.`;
  }
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

// No backend: the form composes the message in the visitor's own email app
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(data.get('subject'));
  const body = encodeURIComponent(`${data.get('message')}\n\n${data.get('name')}`);
  window.location.href = `mailto:zihad.nh@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = 'Your email app should now open with this message. If it does not, write to zihad.nh@gmail.com.';
});
