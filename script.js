const $ = (s, r=document) => r.querySelector(s);

// Year
$('#year').textContent = new Date().getFullYear();

// Theme toggle (saved in localStorage)
const themeBtn = $('#themeBtn');
const saved = localStorage.getItem('theme');
if (saved) document.documentElement.setAttribute('data-theme', saved);

function setBtnState(){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeBtn.setAttribute('aria-pressed', String(isDark));
  themeBtn.textContent = isDark ? 'Mode clair' : 'Mode sombre';
}
setBtnState();

themeBtn.addEventListener('click', () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const next = cur === 'dark' ? '' : 'dark';
  if (next) document.documentElement.setAttribute('data-theme', next);
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('theme', next || '');
  setBtnState();
});

// Palette copy
const toast = $('#toast');
$('#palette').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-color]');
  if (!btn) return;
  const hex = btn.dataset.color;
  try {
    await navigator.clipboard.writeText(hex);
    toast.textContent = `Couleur copiée : ${hex}`;
  } catch {
    toast.textContent = `Impossible de copier. Voici la couleur : ${hex}`;
  }
  window.clearTimeout(window.__toastT);
  window.__toastT = window.setTimeout(() => (toast.textContent = ''), 2200);
});

// Small stat animation (colors count)
const statColors = $('#statColors');
let n = 0;
const target = 6;
const tick = () => {
  n = Math.min(target, n + 1);
  statColors.textContent = String(n);
  if (n < target) setTimeout(tick, 80);
};
tick();

// Contact form demo validation
const form = $('#contactForm');
const hint = $('#formHint');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  hint.textContent = '';

  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();

  if (name.length < 2) return (hint.textContent = 'Ton nom doit faire au moins 2 caractères.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return (hint.textContent = 'Ton email ne semble pas valide.');
  if (message.length < 10) return (hint.textContent = 'Ton message doit faire au moins 10 caractères.');

  hint.textContent = 'Merci ! (Démo) Ton message a été validé côté client — ajoute un backend pour l’envoi.';
  form.reset();
});
