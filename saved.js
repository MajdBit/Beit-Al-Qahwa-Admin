// ===== Saved Items Page =====
let DATA = CafeStore.getData();
let favorites = JSON.parse(localStorage.getItem("beitAlQahwa.favorites") || "[]");

const savedList = document.getElementById("savedList");
const savedCount = document.getElementById("savedCount");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMsg = document.getElementById("toastMsg");

function escapeHtml(value){
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}
function getVisible(list){
  return (list || []).filter(item => item.visible !== false);
}
function saveFavorites(){
  localStorage.setItem("beitAlQahwa.favorites", JSON.stringify(favorites));
}
function toastify(title, msg){
  toastTitle.textContent = title;
  toastMsg.textContent = msg;
  toast.style.display = "block";
  toast.style.opacity = "0";
  toast.style.transform = "translateY(6px)";
  requestAnimationFrame(() => {
    toast.style.transition = "opacity .2s ease, transform .2s ease";
    toast.style.opacity = "1";
    toast.style.transform = "translateY(0)";
  });
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(6px)";
    setTimeout(() => toast.style.display = "none", 220);
  }, 2200);
}
function renderSavedItem(item, index){
  return `
    <div class="item" data-id="${escapeHtml(item.id)}">
      <div class="itemLeft">
        <div class="cup">${String(index + 1).padStart(2, "0")}</div>
        <div>
          <h3>${escapeHtml(item.name)} ${item.badge ? `<span class="tag">${escapeHtml(item.badge)}</span>` : ""}</h3>
          <p>${escapeHtml(item.desc)}</p>
        </div>
      </div>
      <div class="price">
        ${escapeHtml(item.price)}<br>
        <button class="miniBtn favOn" data-fav="${escapeHtml(item.id)}">Saved</button>
      </div>
    </div>`;
}
function bindSavedButtons(){
  savedList.querySelectorAll("[data-fav]").forEach(button => {
    button.addEventListener("click", () => {
      const id = button.dataset.fav;
      favorites = favorites.filter(itemId => itemId !== id);
      saveFavorites();
      renderSavedItems();
      toastify("Removed from saved items", "This menu item was removed from this customer browser.");
    });
  });
}
function renderSavedItems(){
  const visibleMenu = getVisible(DATA.menu);
  const items = visibleMenu.filter(item => favorites.includes(item.id));
  savedCount.textContent = "SAVED: " + items.length;
  savedList.innerHTML = items.length
    ? items.map(renderSavedItem).join("")
    : `<div class="fact"><b>No saved items yet</b><p>Go back to the menu and tap Save on any item.</p></div>`;
  bindSavedButtons();
}
function refreshFromStore(){
  DATA = CafeStore.getData();
  favorites = JSON.parse(localStorage.getItem("beitAlQahwa.favorites") || "[]");
  renderSavedItems();
}

window.addEventListener("storage", event => {
  if(event.key === CafeStore.STORAGE_KEY || event.key === CafeStore.MODIFIED_KEY || event.key === "beitAlQahwa.favorites") refreshFromStore();
});
window.addEventListener("cafe:data", refreshFromStore);
document.addEventListener("visibilitychange", () => {
  if(document.visibilityState === "visible") refreshFromStore();
});

renderSavedItems();


