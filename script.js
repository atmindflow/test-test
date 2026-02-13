const root = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const year = document.getElementById('year');
const toast = document.getElementById('toast');

year.textContent = new Date().getFullYear();

function setTheme(next){
  root.dataset.theme = next;
  localStorage.setItem('theme', next);
}

const saved = localStorage.getItem('theme');
if(saved === 'dark' || saved === 'light'){
  setTheme(saved);
}else{
  // Respect system preference
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  setTheme(prefersDark ? 'dark' : 'light');
}

themeBtn.addEventListener('click', () => {
  const cur = root.dataset.theme === 'dark' ? 'dark' : 'light';
  setTheme(cur === 'dark' ? 'light' : 'dark');
  showToast(`Thème: ${root.dataset.theme}`);
});

// Mood selector demo
const meterFill = document.getElementById('meterFill');
const meterValue = document.getElementById('meterValue');
const segBtns = Array.from(document.querySelectorAll('.seg__btn'));

const moods = {
  sunrise: { value: 72, gradient: ['#ffd6e8', '#d9f2ff', '#f5e3ff'] },
  mint:    { value: 84, gradient: ['#ddf7e3', '#d9f2ff', '#fff1cc'] },
  lilac:   { value: 68, gradient: ['#f5e3ff', '#dfe7ff', '#ffd6e8'] },
};

function applyMood(moodKey){
  const m = moods[moodKey] || moods.sunrise;
  meterFill.style.width = `${m.value}%`;
  meterValue.textContent = `${m.value}%`;
  meterFill.style.background = `linear-gradient(90deg, ${m.gradient.join(',')})`;
}

segBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    segBtns.forEach(b => {
      b.classList.remove('is-active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('is-active');
    btn.setAttribute('aria-selected', 'true');
    applyMood(btn.dataset.mood);
  });
});

// Copy palette colors
const swatches = Array.from(document.querySelectorAll('[data-color]'));
swatches.forEach(s => {
  s.addEventListener('click', async () => {
    const c = s.dataset.color;
    try{
      await navigator.clipboard.writeText(c);
      showToast(`${c} copié`);
    }catch(e){
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = c;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      showToast(`${c} copié`);
    }
  });
});

let toastTimer;
function showToast(msg){
  toast.textContent = msg;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 1400);
}

// Initial mood
applyMood('sunrise');
