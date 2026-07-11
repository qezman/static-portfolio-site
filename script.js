const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const yearEl = $("#year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

const THEME_KEY = "theme";
const root = document.documentElement;
const themeBtn = $("#themeBtn");

function applyTheme(theme) {
  if (theme === "light") root.setAttribute("data-theme", "light");
  else root.removeAttribute("data-theme");
}

const savedTheme = localStorage.getItem(THEME_KEY);
if (savedTheme) applyTheme(savedTheme);

const bar = $(".bar");
if (bar) {
  const onScroll = () => bar.classList.toggle("isScrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  });
}

const navLinks = $$("[data-nav]");
const sections = ["projects", "about", "contact"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function setActive(id) {
  navLinks.forEach((a) => a.classList.toggle("isActive", a.hash === `#${id}`));
}

if (sections.length && navLinks.length) {
  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) setActive(visible.target.id);
    },
    { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
  );

  sections.forEach((s) => io.observe(s));
}

const pills = $$("[data-filter]");
const cards = $$("#projectGrid .card");

function applyFilter(tag) {
  pills.forEach((p) =>
    p.classList.toggle("isActive", p.dataset.filter === tag),
  );
  cards.forEach((c) => {
    const tags = (c.dataset.tags || "").split(/\s+/).filter(Boolean);
    const show = tag === "all" || tags.includes(tag);
    c.style.display = show ? "" : "none";
  });
}

pills.forEach((p) => {
  p.addEventListener("click", () => applyFilter(p.dataset.filter || "all"));
});
