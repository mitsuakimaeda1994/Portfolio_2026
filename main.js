const $ = (q) => document.querySelector(q);

function uniq(arr) {
  return Array.from(new Set(arr));
}

function getWorks() {
  return Array.isArray(window.WORKS) ? window.WORKS : [];
}

function normalizeYouTubeId(value) {
  if (!value) return "";
  const raw = String(value).trim();

  if (!raw.includes("youtube.com") && !raw.includes("youtu.be")) {
    return raw.split("?")[0].split("&")[0].trim();
  }

  try {
    const url = new URL(raw);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      return url.pathname.replace(/^\//, "").split("/")[0];
    }

    if (host === "youtube.com" || host === "m.youtube.com") {
      if (url.searchParams.get("v")) return url.searchParams.get("v");

      const parts = url.pathname.split("/").filter(Boolean);
      const markerIndex = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (markerIndex >= 0 && parts[markerIndex + 1]) return parts[markerIndex + 1];
    }
  } catch {
    return raw.split("?")[0].split("&")[0].trim();
  }

  return "";
}

function getThumbnailUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

function getThumbnailFallbackUrl(videoId) {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

function buildFilters() {
  const wrap = $("#filters");
  if (!wrap) return;

  const works = getWorks();
  const allTags = works.flatMap((w) => w.tags || []);
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

  const works = getWorks();
  const list = filterTag
    ? works.filter((w) => (w.tags || []).includes(filterTag))
    : works;

  list.forEach((w) => {
    const videoId = normalizeYouTubeId(w.youtubeId || w.youtubeUrl || w.url || "");
    if (!videoId) return;

    const card = document.createElement("article");
    card.className = "workCard";

    const link = document.createElement("a");
    link.className = "videoLink";
    link.href = `https://www.youtube.com/watch?v=${videoId}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.setAttribute("aria-label", `${w.title || "YouTube video"} をYouTubeで開く`);

    const thumbWrap = document.createElement("div");
    thumbWrap.className = "videoWrap";

    const img = document.createElement("img");
    img.className = "videoThumb";
    img.loading = "lazy";
    img.alt = w.title || "YouTube thumbnail";
    img.src = getThumbnailUrl(videoId);
    img.onerror = () => {
      img.src = getThumbnailFallbackUrl(videoId);
    };

    thumbWrap.appendChild(img);
    link.appendChild(thumbWrap);

    const body = document.createElement("div");
    body.className = "workBody";

    const h = document.createElement("h3");
    h.className = "workTitle";
    h.textContent = w.title || "Untitled";

    const p = document.createElement("p");
    p.className = "workDesc";
    p.textContent = w.desc || "";

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

    card.appendChild(link);
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
