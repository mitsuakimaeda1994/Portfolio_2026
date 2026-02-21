const $ = (q) => document.querySelector(q);

function thumbUrl(id){
  // maxresが無い動画もあるのでフォールバックする
  return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
}
function thumbFallback(id){
  return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
}

function uniq(arr){
  return Array.from(new Set(arr));
}

function buildFilters(){
  const wrap = $("#filters");
  if (!wrap) return;

  const allTags = window.WORKS.flatMap(w => w.tags || []);
  const tags = uniq(allTags).sort((a,b)=>a.localeCompare(b));

  // "All" を先頭に
  const items = ["All", ...tags];

  wrap.innerHTML = "";
  items.forEach((t, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "filterBtn" + (i===0 ? " active" : "");
    btn.textContent = t;
    btn.dataset.tag = t;

    btn.addEventListener("click", () => {
      wrap.querySelectorAll(".filterBtn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      renderWorks(t === "All" ? null : t);
    });

    wrap.appendChild(btn);
  });
}

function renderWorks(filterTag=null){
  const grid = $("#worksGrid");
  grid.innerHTML = "";

  const list = filterTag
    ? window.WORKS.filter(w => (w.tags || []).includes(filterTag))
    : window.WORKS;

  list.forEach((w) => {
    const card = document.createElement("article");
    card.className = "workCard";

    const img = document.createElement("img");
    img.className = "thumb";
    img.alt = w.title;
    img.src = thumbUrl(w.youtubeId);
    img.onerror = () => { img.src = thumbFallback(w.youtubeId); };

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
    (w.tags || []).forEach(t => {
      const s = document.createElement("span");
      s.className = "tag";
      s.textContent = t;
      tags.appendChild(s);
    });

    body.appendChild(h);
    body.appendChild(p);
    body.appendChild(tags);

    card.appendChild(img);
    card.appendChild(body);

    card.addEventListener("click", () => openModal(w));

    grid.appendChild(card);
  });
}

function openModal(w){
  const modal = $("#modal");
  $("#mTitle").textContent = w.title;
  $("#mDesc").textContent = w.desc;

  const tagsWrap = $("#mTags");
  tagsWrap.innerHTML = "";
  (w.tags || []).forEach(t => {
    const s = document.createElement("span");
    s.className = "tag";
    s.textContent = t;
    tagsWrap.appendChild(s);
  });

  const player = $("#mPlayer");
  player.src = `https://www.youtube.com/embed/${w.youtubeId}?autoplay=1`;

  modal.showModal();

  // close時に再生停止
  modal.addEventListener("close", () => {
    player.src = "";
  }, { once: true });
}

function initMeta(){
  $("#year").textContent = String(new Date().getFullYear());

  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  $("#updated").textContent = `${yyyy}-${mm}-${dd}`;
}

document.addEventListener("DOMContentLoaded", () => {
  initMeta();
  buildFilters();
  renderWorks();
});