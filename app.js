// The Cursor — page behaviour. Lore, states and rules come from data.js (generated from
// the character file); the memories' captions live here.
(() => {
  const C = window.CURSOR;
  const $ = (s) => document.querySelector(s);
  const el = (tag, cls, html) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html !== undefined) n.innerHTML = html;
    return n;
  };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ── 02 lore ──────────────────────────────────────
  const lore = $("#lore-list");
  C.lore.forEach((b, i) => {
    // a break in time: the computer restarts between the shutdown and now
    if (b.divider) lore.append(el("li", "lore-divider reveal", `<span>${esc(b.divider.toUpperCase())}</span>`));
    const li = el("li", `beat reveal ${b.source}`);
    li.append(
      el("span", "beat-i", String(i + 1).padStart(2, "0")),
      el("span", "beat-when", esc(b.when)),
      el("p", "beat-what", esc(b.what)),
      el("span", `tag ${b.source}`, b.source === "canon" ? "BLISS · ORIGINAL" : "CONTINUATION")
    );
    lore.append(li);
  });
  $("#status-text").textContent = `"${C.relationship.status}"`;
  const rules = $("#rules-list");
  C.relationship.rules.forEach((r) => rules.append(el("li", "", esc(r))));

  // ── 01 memories ──────────────────────────────────
  // every photo is a real BLISS image (claudia.gallery/bliss); `src` names the original
  const MEMORIES = [
    { id: "01-the-hill", src: "hill-gown-1", title: "the hill", caption: "the bliss gown. the hill. the sky she wore." },
    { id: "02-the-drop", src: "fight-trench-2", title: "the drop", caption: "i came back building-sized. she was ready." },
    { id: "03-the-bin", src: "her-trench-dragged-2", title: "the bin", caption: "i dragged her to the bin by the collar. she hit ctrl+z." },
    { id: "04-the-ride", src: "her-cursor-ride-3", title: "the ride", caption: "the fight turned into a dance. she surfed me down the hill." },
    { id: "05-the-dancer", src: "dance-holo-2", title: "the desktop dancer", caption: "she danced on the taskbar." },
    { id: "06-golden-hour", src: "wp-bliss-golden-1", title: "golden hour", caption: "her wallpaper, golden hour." },
    { id: "07-three-am", src: "wp-bliss-night-1", title: "3:01 am", caption: "her wallpaper, night." },
    { id: "08-tulips", src: "wp-tulips-1", title: "tulips", caption: "a window she opened." },
    { id: "09-autumn", src: "wp-autumn-1", title: "autumn", caption: "a window she opened." },
    { id: "10-red-moon", src: "wp-redmoon-1", title: "red moon", caption: "a window she opened." },
    { id: "11-stones", src: "wp-stones-1", title: "stones", caption: "a window she opened." },
    { id: "12-ripple", src: "wp-ripple-1", title: "ripple", caption: "a window she closed." },
  ];
  const tilts = [-1.6, 1.1, -0.6, 1.4, -1.2, 0.8, 1.3, -0.9, 0.7, -1.4, 1.0, -0.5];
  const grid = $("#memory-grid");
  MEMORIES.forEach((m, i) => {
    const b = el("button", "memory reveal");
    b.type = "button";
    b.style.setProperty("--tilt", `${tilts[i]}deg`);
    b.setAttribute("aria-label", `Open memory ${i + 1}: ${m.title}`);
    b.innerHTML = `<img src="img/memories/${m.id}.jpg" alt="Memory ${i + 1}, ${esc(m.title)}: from BLISS (${m.src}), with The Cursor" loading="lazy" />
      <figcaption><span class="m-id">MEMORY ${String(i + 1).padStart(2, "0")} · ${esc(m.title.toUpperCase())} · ${esc(m.src)}</span><span class="m-text">${esc(m.caption)}</span></figcaption>`;
    b.addEventListener("click", () => openViewer(i));
    grid.append(b);
  });

  // memory viewer
  const viewer = $("#viewer");
  let at = 0;
  let lastFocus = null;
  const show = (i) => {
    at = (i + MEMORIES.length) % MEMORIES.length;
    const m = MEMORIES[at];
    $("#viewer-img").src = `img/memories/${m.id}.jpg`;
    $("#viewer-img").alt = `Memory ${at + 1}, ${m.title}`;
    $("#viewer-title").textContent = `memory_${String(at + 1).padStart(2, "0")}.jpg`;
    $("#viewer-caption").textContent = m.caption;
  };
  const openViewer = (i) => {
    lastFocus = document.activeElement;
    show(i);
    viewer.hidden = false;
    $("#viewer-close").focus();
  };
  const closeViewer = () => {
    viewer.hidden = true;
    if (lastFocus) lastFocus.focus();
  };
  $("#viewer-close").addEventListener("click", closeViewer);
  $("#viewer-prev").addEventListener("click", () => show(at - 1));
  $("#viewer-next").addEventListener("click", () => show(at + 1));
  viewer.addEventListener("click", (e) => { if (e.target === viewer) closeViewer(); });
  document.addEventListener("keydown", (e) => {
    if (viewer.hidden) return;
    if (e.key === "Escape") closeViewer();
    if (e.key === "ArrowLeft") show(at - 1);
    if (e.key === "ArrowRight") show(at + 1);
  });

  // ── 03 his face — hovering a card turns the page's cursor into that state ──
  const states = $("#state-grid");
  C.states.forEach((s) => {
    const card = el("div", "state reveal");
    card.dataset.cursor = s.id;
    card.innerHTML = `<div class="state-glyph"><img src="img/glyph/${s.id}@1x.png" alt="${s.id} cursor" /></div>
      <div><h3>${esc(s.glyph)}&nbsp; ${esc(s.id)}</h3><p class="mood">${esc(s.mood)}</p><p class="ex">"${esc(s.example)}"</p><p class="when">use when ${esc(s.useWhen)}</p></div>`;
    states.append(card);
  });

  // ── 04 never ─────────────────────────────────────
  const never = $("#never-list");
  C.never.forEach((n) => {
    const li = el("li", "reveal", esc(n));
    li.dataset.cursor = "no";
    never.append(li);
  });

  // ── nav: mark the section in view ────────────────
  const links = [...document.querySelectorAll(".nav-links a[href^='#']")];
  const sections = links.map((a) => $(a.getAttribute("href")));
  const navIO = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  sections.forEach((s) => s && navIO.observe(s));

  // ── reveal on scroll, staggered ──────────────────
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const sibs = [...en.target.parentElement.children];
      en.target.style.transitionDelay = `${Math.min(sibs.indexOf(en.target), 8) * 70}ms`;
      en.target.classList.add("in");
      io.unobserve(en.target);
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((n) => io.observe(n));

  // ── mouse trails over the hero (desktop, motion allowed) ──
  const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer: fine)").matches;
  if (!calm && fine) {
    const hero = $(".hero");
    const layer = $("#trails");
    const ghosts = Array.from({ length: 6 }, (_, i) => {
      const g = el("img");
      g.src = "img/glyph/arrow@2x.png";
      g.alt = "";
      g.style.opacity = "0";
      layer.append(g);
      return { g, x: 0, y: 0, o: 0.36 - i * 0.055 };
    });
    let mx = 0, my = 0, inHero = false;
    hero.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; inHero = true; });
    hero.addEventListener("mouseleave", () => { inHero = false; });
    const tick = () => {
      let px = mx, py = my;
      ghosts.forEach((t) => {
        t.x += (px - t.x) * 0.35;
        t.y += (py - t.y) * 0.35;
        const far = Math.hypot(mx - t.x, my - t.y) > 4;
        t.g.style.transform = `translate(${t.x}px, ${t.y}px)`;
        t.g.style.opacity = inHero && far ? String(t.o) : "0";
        px = t.x; py = t.y;
      });
      requestAnimationFrame(tick);
    };
    tick();
  }

  // the hourglass while the page loads, then the arrow
  window.addEventListener("load", () => setTimeout(() => document.body.classList.remove("loading"), 450));
})();
