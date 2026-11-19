// Replace these with your own images (e.g. "images/photo1.jpg")
const photos = [
  { src: "https://picsum.photos/id/1018/1200/800", title: "Mountain lake",  cat: "nature" },
  { src: "https://picsum.photos/id/1015/1200/800", title: "River valley",   cat: "nature" },
  { src: "https://picsum.photos/id/1039/1200/800", title: "Waterfall",      cat: "nature" },
  { src: "https://picsum.photos/id/1074/1200/800", title: "Lion",           cat: "animals" },
  { src: "https://picsum.photos/id/237/1200/800",  title: "Puppy",          cat: "animals" },
  { src: "https://picsum.photos/id/1025/1200/800", title: "Pug",            cat: "animals" },
  { src: "https://picsum.photos/id/1031/1200/800", title: "Streets",        cat: "city" },
  { src: "https://picsum.photos/id/1067/1200/800", title: "Skyline",        cat: "city" },
  { src: "https://picsum.photos/id/1048/1200/800", title: "Bridge",         cat: "city" },
];

const gallery = document.getElementById("gallery");
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lb-img");
const lbCaption = document.getElementById("lb-caption");

let visible = [];   // currently shown (filtered) photos
let current = 0;

// Build gallery
photos.forEach((p, i) => {
  const el = document.createElement("div");
  el.className = "item";
  el.tabIndex = 0;
  el.dataset.cat = p.cat;
  el.dataset.index = i;
  el.innerHTML = `<img src="${p.src.replace("1200/800", "600/450")}" alt="${p.title}" loading="lazy"><span>${p.title}</span>`;
  gallery.appendChild(el);
});

const items = [...document.querySelectorAll(".item")];

// Filters
document.getElementById("filters").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  document.querySelector(".filters .active").classList.remove("active");
  btn.classList.add("active");
  items.forEach((el) => {
    const show = btn.dataset.filter === "all" || el.dataset.cat === btn.dataset.filter;
    el.classList.toggle("hide", !show);
  });
});

// Lightbox
function getVisible() {
  return items.filter((el) => !el.classList.contains("hide")).map((el) => +el.dataset.index);
}
function show(pos) {
  current = (pos + visible.length) % visible.length;
  const p = photos[visible[current]];
  lbImg.classList.add("loading");
  lbImg.onload = () => lbImg.classList.remove("loading");
  lbImg.src = p.src;
  lbImg.alt = p.title;
  lbCaption.textContent = `${p.title} (${current + 1}/${visible.length})`;
}
function open(index) {
  visible = getVisible();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  show(visible.indexOf(index));
}
function close() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}

gallery.addEventListener("click", (e) => {
  const el = e.target.closest(".item");
  if (el) open(+el.dataset.index);
});
gallery.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.target.classList.contains("item")) open(+e.target.dataset.index);
});

document.getElementById("next").onclick = () => show(current + 1);
document.getElementById("prev").onclick = () => show(current - 1);
document.getElementById("close").onclick = close;
lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "ArrowRight") show(current + 1);
  if (e.key === "ArrowLeft") show(current - 1);
  if (e.key === "Escape") close();
});

// Touch swipe
let startX = 0;
lightbox.addEventListener("touchstart", (e) => (startX = e.touches[0].clientX));
lightbox.addEventListener("touchend", (e) => {
  const dx = e.changedTouches[0].clientX - startX;
  if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
});
