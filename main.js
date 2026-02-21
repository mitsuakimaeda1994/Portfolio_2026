const $ = (q) => document.querySelector(q);

function uniq(arr) {
  return Array.from(new Set(arr));
}

function buildFilters() {
  const wrap = $("#filters");
  if (!wrap) return;

  const allTags = window.WORKS.flatMap((w) => w.tags || []);
  const tags = uniq(allTags).sort((a, b) => a.localeCompare(b));
  const items = ["All", ...tags];

  wrap.innerHTML = "";
  items.forEach((t, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filterBtn" + (i === 0 ? " active" : "");
    btn.textContent = t;
    btn.dataset.tag = t;

    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filterBtn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderWorks(t === "All" ? null : t);
    });

    wrap.appendChild(btn);
  });
}

function renderWorks(filterTag = null) {
  const grid = $("#worksGrid");
  if (!grid) return;

  grid.innerHTML = "";

  const list = filterTag
    ? window.WORKS.filter((w) => (w.tags || []).includes(filterTag))
    : window.WORKS;

  list.forEach((w) => {
    const card = document.createElement("article");
    card.className = "workCard";

    const playerWrap = document.createElement("div");
    playerWrap.className = "videoWrap";

    const iframe = document.createElement("iframe");
    iframe.src = `https://www.youtube.com/embed/${w.youtubeId}`;
    iframe.title = w.title;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;

    playerWrap.appendChild(iframe);

    const body = document.createElement("div");
    body.className = "workBody";

    const h = document.createElement("h3");
    h.className = "workTitle";
    h.textContent = w.title;

    const p = document.createElement("p");
    p.className = "workDesc";
    p.textContent = w.desc;

    const tags = document.createElement("div");
    tags.className = "tags";
    (w.tags || []).forEach((t) => {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tags.appendChild(s);
    });

    body.appendChild(h);
    body.appendChild(p);
    body.appendChild(tags);

    card.appendChild(playerWrap);
    card.appendChild(body);

    grid.appendChild(card);
  });
}

function initMeta() {
  const year = $("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const updated = $("#updated");
  if (!updated) return;

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  updated.textContent = `${yyyy}-${mm}-${dd}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initMeta();
  buildFilters();
  renderWorks();
});
