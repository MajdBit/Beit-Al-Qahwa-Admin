
// ===== Owner Dashboard =====
let DATA = CafeStore.getData();
let editingMenuId = "";
let editingEventId = "";

const loginScreen = document.getElementById("loginScreen");
const adminApp = document.getElementById("adminApp");
const pinInput = document.getElementById("pinInput");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const toast = document.getElementById("toast");
const toastTitle = document.getElementById("toastTitle");
const toastMsg = document.getElementById("toastMsg");
const stats = document.getElementById("stats");

const panelButtons = document.querySelectorAll("[data-panel]");
const panels = document.querySelectorAll(".adminPanel");

const menuRows = document.getElementById("menuRows");
const menuId = document.getElementById("menuId");
const menuName = document.getElementById("menuName");
const menuPrice = document.getElementById("menuPrice");
const menuCat = document.getElementById("menuCat");
const menuVisible = document.getElementById("menuVisible");
const menuVibe = document.getElementById("menuVibe");
const menuTier = document.getElementById("menuTier");
const menuBadge = document.getElementById("menuBadge");
const menuDesc = document.getElementById("menuDesc");
const saveMenu = document.getElementById("saveMenu");
const clearMenu = document.getElementById("clearMenu");

const eventRows = document.getElementById("eventRows");
const eventId = document.getElementById("eventId");
const eventTitle = document.getElementById("eventTitle");
const eventTag = document.getElementById("eventTag");
const eventVisible = document.getElementById("eventVisible");
const eventMeta = document.getElementById("eventMeta");
const saveEvent = document.getElementById("saveEvent");
const clearEvent = document.getElementById("clearEvent");

const tableRows = document.getElementById("tableRows");
const tableMode = document.getElementById("tableMode");
const tableId = document.getElementById("tableId");
const tableName = document.getElementById("tableName");
const tableDesc = document.getElementById("tableDesc");
const tableCapacity = document.getElementById("tableCapacity");
const saveTable = document.getElementById("saveTable");
const clearTable = document.getElementById("clearTable");
const deleteTable = document.getElementById("deleteTable");

const reservationRows = document.getElementById("reservationRows");
const clearDoneReservations = document.getElementById("clearDoneReservations");
const clearAllReservations = document.getElementById("clearAllReservations");

const announcement = document.getElementById("announcement");
const heroImgPreview = document.getElementById("heroImgPreview");
const heroImgThumb = document.getElementById("heroImgThumb");
const heroImgNone = document.getElementById("heroImgNone");
const heroCameraIn = document.getElementById("heroCameraIn");
const heroFileIn = document.getElementById("heroFileIn");
const heroImgEdit = document.getElementById("heroImgEdit");
const heroImgClear = document.getElementById("heroImgClear");
let currentHeroImage = "";
const brewingHeadingInput = document.getElementById("brewingHeadingInput");
const brewingTitleInput = document.getElementById("brewingTitleInput");
const brewingBodyInput = document.getElementById("brewingBodyInput");
const vibeInside = document.getElementById("vibeInside");
const vibeOutside = document.getElementById("vibeOutside");
const cafeAreaSetting = document.getElementById("cafeAreaSetting");
const whatsappSetting = document.getElementById("whatsappSetting");
const mapsSetting = document.getElementById("mapsSetting");
const openHourSetting = document.getElementById("openHourSetting");
const closeHourSetting = document.getElementById("closeHourSetting");
const newPin = document.getElementById("newPin");
const saveSettings = document.getElementById("saveSettings");
const socialUrlInputs = document.querySelectorAll("[data-social-url]");
const socialVisibleInputs = document.querySelectorAll("[data-social-visible]");

const exportData = document.getElementById("exportData");
const exportTop = document.getElementById("exportTop");
const importData = document.getElementById("importData");
const resetData = document.getElementById("resetData");
const backupBox = document.getElementById("backupBox");

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
  }, 2600);
}

function escapeHtml(value){
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function save(mutator){
  try{
    DATA = CafeStore.updateData(mutator);
    renderAll();
    return true;
  }catch(err){
    console.error("Save failed:", err);
    toastify("Save failed", "The image was too large to store. Try a smaller photo.");
    return false;
  }
}
function requireLogin(){
  const logged = sessionStorage.getItem("beitAlQahwa.owner.logged") === "true";
  loginScreen.hidden = logged;
  adminApp.hidden = !logged;
  logoutBtn.hidden = !logged;
  if(logged) renderAll();
}

loginBtn.addEventListener("click", () => {
  DATA = CafeStore.getData();
  if(pinInput.value === DATA.ownerPin){
    sessionStorage.setItem("beitAlQahwa.owner.logged", "true");
    pinInput.value = "";
    requireLogin();
    toastify("Welcome back", "Owner dashboard unlocked.");
  } else {
    toastify("Wrong PIN", "Try again, or reset demo data from the file if you forgot it.");
  }
});
pinInput.addEventListener("keydown", (e) => { if(e.key === "Enter") loginBtn.click(); });
logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("beitAlQahwa.owner.logged");
  requireLogin();
});

panelButtons.forEach(btn => btn.addEventListener("click", () => {
  panelButtons.forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  const id = btn.dataset.panel;
  panels.forEach(p => p.classList.toggle("active", p.id === id));
}));

function renderStats(){
  const visibleMenu = DATA.menu.filter(x => x.visible !== false).length;
  const visibleEvents = DATA.events.filter(x => x.visible !== false).length;
  const availableInside = DATA.tables.filter(t => t.inside === "available").length;
  const newReservations = DATA.reservations.filter(r => r.status === "new").length;
  stats.innerHTML = `
    <div class="statCard"><b>${visibleMenu}</b><span>visible menu items</span></div>
    <div class="statCard"><b>${visibleEvents}</b><span>published events</span></div>
    <div class="statCard"><b>${availableInside}</b><span>inside tables open</span></div>
    <div class="statCard"><b>${newReservations}</b><span>new reservations</span></div>
  `;
}

function renderMenuRows(){
  menuRows.innerHTML = DATA.menu.map(item => `
    <div class="adminRow">
      <div>
        <b>${escapeHtml(item.name)} ${item.visible === false ? "<span class='tag'>HIDDEN</span>" : ""}</b>
        <span>${escapeHtml(item.price)} - ${escapeHtml(item.cat)} - ${escapeHtml(item.vibe || "traditional")} - ${escapeHtml(item.priceTier || "$" )} - ${escapeHtml(item.badge || "") } - ${escapeHtml(item.desc)}</span>
      </div>
      <div class="rowActions">
        <button class="btn" data-edit-menu="${escapeHtml(item.id)}">Edit</button>
        <button class="btn" data-toggle-menu="${escapeHtml(item.id)}">${item.visible === false ? "Show" : "Hide"}</button>
        <button class="btn danger" data-delete-menu="${escapeHtml(item.id)}">Delete</button>
      </div>
    </div>
  `).join("");
  menuRows.querySelectorAll("[data-edit-menu]").forEach(btn => btn.addEventListener("click", () => editMenu(btn.dataset.editMenu)));
  menuRows.querySelectorAll("[data-toggle-menu]").forEach(btn => btn.addEventListener("click", () => toggleMenu(btn.dataset.toggleMenu)));
  menuRows.querySelectorAll("[data-delete-menu]").forEach(btn => btn.addEventListener("click", () => deleteMenu(btn.dataset.deleteMenu)));
}
function clearMenuForm(){
  editingMenuId = "";
  menuId.value = "";
  menuName.value = "";
  menuPrice.value = "";
  menuCat.value = (DATA.categories && DATA.categories[0]) ? DATA.categories[0].id : "";
  menuVisible.value = "true";
  if(menuVibe) menuVibe.value = "traditional";
  if(menuTier) menuTier.value = "$";
  if(menuBadge) menuBadge.value = "";
  menuDesc.value = "";
  saveMenu.innerHTML = `Save Item`;
}
function editMenu(id){
  const item = DATA.menu.find(x => x.id === id);
  if(!item) return;
  editingMenuId = id;
  menuId.value = id;
  menuName.value = item.name;
  menuPrice.value = item.price;
  menuCat.value = item.cat;
  menuVisible.value = String(item.visible !== false);
  if(menuVibe) menuVibe.value = item.vibe || "traditional";
  if(menuTier) menuTier.value = item.priceTier || "$";
  if(menuBadge) menuBadge.value = item.badge || "";
  menuDesc.value = item.desc;
  saveMenu.innerHTML = `Update Item`;
  document.getElementById("menuPanel").scrollIntoView({behavior:"smooth", block:"start"});
}
function toggleMenu(id){
  save(data => {
    const item = data.menu.find(x => x.id === id);
    if(item) item.visible = item.visible === false;
  });
  toastify("Updated", "Menu visibility changed.");
}
function deleteMenu(id){
  if(!confirm("Delete this menu item?")) return;
  save(data => { data.menu = data.menu.filter(x => x.id !== id); });
  toastify("Deleted", "Menu item removed.");
}
saveMenu.addEventListener("click", () => {
  const payload = {
    id: editingMenuId || CafeStore.uid("menu"),
    name: menuName.value.trim(),
    price: menuPrice.value.trim(),
    cat: menuCat.value,
    vibe: menuVibe ? menuVibe.value : "traditional",
    priceTier: menuTier ? menuTier.value : "$",
    badge: menuBadge ? menuBadge.value.trim() : "",
    visible: menuVisible.value === "true",
    desc: menuDesc.value.trim()
  };
  if(!payload.name || !payload.price || !payload.desc){
    toastify("Missing details", "Add item name, price, and description.");
    return;
  }
  save(data => {
    const index = data.menu.findIndex(x => x.id === payload.id);
    if(index >= 0) data.menu[index] = payload;
    else data.menu.unshift(payload);
  });
  clearMenuForm();
  toastify("Saved", "Menu updated on the customer page.");
});
clearMenu.addEventListener("click", clearMenuForm);

function renderEventRows(){
  eventRows.innerHTML = DATA.events.map(item => `
    <div class="adminRow">
      <div>
        <b>${escapeHtml(item.title)} ${item.visible === false ? "<span class='tag'>HIDDEN</span>" : ""}</b>
        <span>${escapeHtml(item.tag)} - ${escapeHtml(item.meta)}</span>
      </div>
      <div class="rowActions">
        <button class="btn" data-edit-event="${escapeHtml(item.id)}">Edit</button>
        <button class="btn" data-toggle-event="${escapeHtml(item.id)}">${item.visible === false ? "Show" : "Hide"}</button>
        <button class="btn danger" data-delete-event="${escapeHtml(item.id)}">Delete</button>
      </div>
    </div>
  `).join("");
  eventRows.querySelectorAll("[data-edit-event]").forEach(btn => btn.addEventListener("click", () => editEvent(btn.dataset.editEvent)));
  eventRows.querySelectorAll("[data-toggle-event]").forEach(btn => btn.addEventListener("click", () => toggleEvent(btn.dataset.toggleEvent)));
  eventRows.querySelectorAll("[data-delete-event]").forEach(btn => btn.addEventListener("click", () => deleteEvent(btn.dataset.deleteEvent)));
}
function clearEventForm(){
  editingEventId = "";
  eventId.value = "";
  eventTitle.value = "";
  eventTag.value = "";
  eventVisible.value = "true";
  eventMeta.value = "";
  saveEvent.innerHTML = `Save Event`;
}
function editEvent(id){
  const item = DATA.events.find(x => x.id === id);
  if(!item) return;
  editingEventId = id;
  eventId.value = id;
  eventTitle.value = item.title;
  eventTag.value = item.tag;
  eventVisible.value = String(item.visible !== false);
  eventMeta.value = item.meta;
  saveEvent.innerHTML = `Update Event`;
}
function toggleEvent(id){
  save(data => {
    const item = data.events.find(x => x.id === id);
    if(item) item.visible = item.visible === false;
  });
  toastify("Updated", "Event visibility changed.");
}
function deleteEvent(id){
  if(!confirm("Delete this event?")) return;
  save(data => { data.events = data.events.filter(x => x.id !== id); });
  toastify("Deleted", "Event removed.");
}
saveEvent.addEventListener("click", () => {
  const payload = {
    id: editingEventId || CafeStore.uid("event"),
    title: eventTitle.value.trim(),
    tag: eventTag.value.trim().toUpperCase(),
    visible: eventVisible.value === "true",
    meta: eventMeta.value.trim()
  };
  if(!payload.title || !payload.tag || !payload.meta){
    toastify("Missing details", "Add event title, tag, and details.");
    return;
  }
  save(data => {
    const index = data.events.findIndex(x => x.id === payload.id);
    if(index >= 0) data.events[index] = payload;
    else data.events.unshift(payload);
  });
  clearEventForm();
  toastify("Saved", "Events board updated.");
});
clearEvent.addEventListener("click", clearEventForm);

function clearTableForm(){
  tableId.value = "";
  tableName.value = "";
  tableDesc.value = "";
  tableCapacity.value = "";
  deleteTable.style.display = "none";
}

function loadTableForEditing(tableObj){
  tableId.value = tableObj.id;
  tableName.value = tableObj.id;
  tableDesc.value = tableObj.label;
  tableCapacity.value = tableObj.seats || 1;
  deleteTable.style.display = "block";
}

function renderTableRows(){
  const mode = tableMode.value;
  tableRows.innerHTML = DATA.tables.map(t => `
    <div class="adminRow">
      <div>
        <b>${escapeHtml(t.id)} - ${escapeHtml(t.label)}</b>
        <span>${Number(t.seats || 1)} seat${Number(t.seats || 1)>1?"s":""} - Current ${mode}: ${escapeHtml(t[mode])}</span>
      </div>
      <div class="rowActions">
        <button class="btn" data-table-edit="${escapeHtml(t.id)}">Edit</button>
        <select class="statusSelect" data-table-status="${escapeHtml(t.id)}">
          <option value="available" ${t[mode] === "available" ? "selected" : ""}>Available</option>
          <option value="busy" ${t[mode] === "busy" ? "selected" : ""}>Busy</option>
          <option value="reserved" ${t[mode] === "reserved" ? "selected" : ""}>Reserved</option>
          <option value="closed" ${t[mode] === "closed" ? "selected" : ""}>Closed</option>
        </select>
      </div>
    </div>
  `).join("");
  
  tableRows.querySelectorAll("[data-table-edit]").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.tableEdit;
      const tableObj = DATA.tables.find(t => t.id === id);
      if(tableObj) loadTableForEditing(tableObj);
    });
  });
  
  tableRows.querySelectorAll("[data-table-status]").forEach(select => {
    select.addEventListener("change", () => {
      const id = select.dataset.tableStatus;
      save(data => {
        const table = data.tables.find(t => t.id === id);
        if(table) table[mode] = select.value;
      });
      toastify("Table updated", `${id} is now ${select.value} for ${mode} mode.`);
    });
  });
}

saveTable.addEventListener("click", () => {
  const newName = tableName.value.trim().toUpperCase();
  const newDesc = tableDesc.value.trim();
  const newCapacity = parseInt(tableCapacity.value) || 1;
  const currentId = tableId.value;
  
  if(!newName || !newDesc || newCapacity < 1){
    toastify("Missing details", "Add table name, description, and capacity.");
    return;
  }
  
  save(data => {
    const tableIndex = data.tables.findIndex(t => t.id === currentId);
    if(tableIndex >= 0){
      data.tables[tableIndex].id = newName;
      data.tables[tableIndex].label = newDesc;
      data.tables[tableIndex].seats = newCapacity;
    } else {
      data.tables.unshift({
        id: newName,
        label: newDesc,
        seats: newCapacity,
        inside: "available",
        outside: "available"
      });
    }
  });
  
  clearTableForm();
  toastify("Saved", currentId ? "Table updated." : "Table added.");
});

clearTable.addEventListener("click", clearTableForm);

deleteTable.addEventListener("click", () => {
  if(!confirm("Delete this table? This cannot be undone.")) return;
  const idToDelete = tableId.value;
  save(data => {
    data.tables = data.tables.filter(t => t.id !== idToDelete);
  });
  clearTableForm();
  toastify("Deleted", "Table removed.");
});

tableMode.addEventListener("change", renderTableRows);

function renderReservations(){
  if(!DATA.reservations.length){
    reservationRows.innerHTML = `<div class="fact"><b>No reservations yet</b><p>Customer requests will appear here once submitted from the website.</p></div>`;
    return;
  }
  reservationRows.innerHTML = DATA.reservations.map(r => `
    <div class="adminRow">
      <div>
        <b>${escapeHtml(r.name)} - Table ${escapeHtml(r.table)} <span class="tag">${escapeHtml(r.status || "new").toUpperCase()}</span></b>
        <span>${escapeHtml(r.phone || "No phone")} - ${escapeHtml(r.date)} at ${escapeHtml(r.time)} - ${escapeHtml(r.guests)} guest(s) - ${escapeHtml(r.mode)}${r.note ? " - Note: " + escapeHtml(r.note) : ""}</span>
      </div>
      <div class="rowActions">
        <button class="btn" data-res-status="confirmed" data-res-id="${escapeHtml(r.id)}">Confirm</button>
        <button class="btn" data-res-status="done" data-res-id="${escapeHtml(r.id)}">Done</button>
        <button class="btn danger" data-res-delete="${escapeHtml(r.id)}">Delete</button>
      </div>
    </div>
  `).join("");
  reservationRows.querySelectorAll("[data-res-status]").forEach(btn => btn.addEventListener("click", () => {
    save(data => {
      const res = data.reservations.find(r => r.id === btn.dataset.resId);
      if(res) res.status = btn.dataset.resStatus;
    });
    toastify("Reservation updated", "Status changed.");
  }));
  reservationRows.querySelectorAll("[data-res-delete]").forEach(btn => btn.addEventListener("click", () => {
    if(!confirm("Delete this reservation?")) return;
    save(data => { data.reservations = data.reservations.filter(r => r.id !== btn.dataset.resDelete); });
    toastify("Deleted", "Reservation removed.");
  }));
}
clearDoneReservations.addEventListener("click", () => {
  save(data => { data.reservations = data.reservations.filter(r => r.status !== "done"); });
  toastify("Cleaned", "Completed reservations deleted.");
});
clearAllReservations.addEventListener("click", () => {
  if(!confirm("Delete all reservations?")) return;
  save(data => { data.reservations = []; });
  toastify("Cleared", "All reservations deleted.");
});

function renderSettingsForm(){
  const s = DATA.settings || {};
  announcement.value = s.announcement || "";
  currentHeroImage = s.heroBgImage || "";
  updateHeroImagePreview();
  brewingHeadingInput.value = s.brewingHeading || "Now Brewing";
  brewingTitleInput.value = s.brewingTitle || "Audio cue (optional in production)";
  brewingBodyInput.value = s.brewingBody || "";
  vibeInside.value = s.vibeLineInside || "";
  vibeOutside.value = s.vibeLineOutside || "";
  if(cafeAreaSetting) cafeAreaSetting.value = s.area || "";
  if(whatsappSetting) whatsappSetting.value = s.whatsapp || "";
  if(mapsSetting) mapsSetting.value = s.maps || "";
  socialUrlInputs.forEach(input => {
    const link = (s.socialLinks || []).find(item => item.id === input.dataset.socialUrl);
    input.value = link?.url || "";
  });
  socialVisibleInputs.forEach(input => {
    const link = (s.socialLinks || []).find(item => item.id === input.dataset.socialVisible);
    input.checked = link ? link.visible !== false : false;
  });
  if(openHourSetting) openHourSetting.value = s.openHour || "08:00";
  if(closeHourSetting) closeHourSetting.value = s.closeHour || "23:00";
  newPin.value = "";
}
saveSettings.addEventListener("click", () => {
  const previewHeroImage = heroImgThumb?.src?.startsWith("data:image/") ? heroImgThumb.src : "";
  const saved = save(data => {
    data.settings.announcement = announcement.value.trim();
    data.settings.heroBgImage = currentHeroImage || previewHeroImage;
    data.settings.brewingHeading = brewingHeadingInput.value.trim() || "Now Brewing";
    data.settings.brewingTitle = brewingTitleInput.value.trim() || "Now Brewing";
    data.settings.brewingBody = brewingBodyInput.value.trim();
    data.settings.vibeLineInside = vibeInside.value.trim();
    data.settings.vibeLineOutside = vibeOutside.value.trim();
    if(cafeAreaSetting) data.settings.area = cafeAreaSetting.value.trim();
    if(whatsappSetting) data.settings.whatsapp = whatsappSetting.value.trim();
    if(mapsSetting) data.settings.maps = mapsSetting.value.trim();
    data.settings.socialLinks = (data.settings.socialLinks || []).map(link => {
      const urlInput = document.querySelector(`[data-social-url="${link.id}"]`);
      const visibleInput = document.querySelector(`[data-social-visible="${link.id}"]`);
      return {
        ...link,
        url: urlInput ? urlInput.value.trim() : link.url,
        visible: visibleInput ? visibleInput.checked : link.visible !== false
      };
    });
    if(openHourSetting) data.settings.openHour = openHourSetting.value || "08:00";
    if(closeHourSetting) data.settings.closeHour = closeHourSetting.value || "23:00";
    if(newPin.value.trim()) data.ownerPin = newPin.value.trim();
  });
  if(!saved) return;
  renderSettingsForm();
  toastify("Settings saved", newPin.value.trim() ? "Settings updated. New PIN is active." : "Customer page settings updated.");
});

function exportJson(){
  DATA = CafeStore.getData();
  backupBox.value = JSON.stringify(DATA, null, 2);
  document.querySelector('[data-panel="dataPanel"]').click();
  toastify("Export ready", "Your JSON backup is in the box.");
}
exportData.addEventListener("click", exportJson);
exportTop.addEventListener("click", exportJson);
importData.addEventListener("click", () => {
  try{
    const parsed = JSON.parse(backupBox.value);
    DATA = CafeStore.saveData(parsed);
    renderAll();
    toastify("Imported", "Backup restored successfully.");
  }catch(err){
    toastify("Import failed", "The JSON is invalid. Check commas, brackets, and quotes.");
  }
});
resetData.addEventListener("click", () => {
  if(!confirm("Reset all demo data? This will remove edits and reservations.")) return;
  DATA = CafeStore.resetData();
  renderAll();
  toastify("Reset complete", "Demo data restored.");
});

function renderAll(){
  try{
    DATA = CafeStore.getData();
    renderStats();
    renderMenuRows();
    renderEventRows();
    renderTableRows();
    renderReservations();
    renderSettingsForm();
  }catch(err){
    console.error("Dashboard render failed:", err);
    toastify("Dashboard error", "The dashboard could not finish loading. Check the browser console for details.");
  }
}

window.addEventListener("storage", (e) => {
  if(e.key === CafeStore.STORAGE_KEY) renderAll();
});
window.addEventListener("cafe:data", renderAll);

// ===== Expanded Managers: cafe finder, collections, gallery, reviews =====
let editingCafeId = "", editingCollectionId = "", editingGalleryId = "";
const cafeRows = document.getElementById("cafeRows");
const cafeId = document.getElementById("cafeId");
const cafeNameInput = document.getElementById("cafeNameInput");
const cafeAreaInput = document.getElementById("cafeAreaInput");
const cafeVibeInput = document.getElementById("cafeVibeInput");
const cafeTierInput = document.getElementById("cafeTierInput");
const cafeRatingInput = document.getElementById("cafeRatingInput");
const cafeBadgeInput = document.getElementById("cafeBadgeInput");
const cafeVisibleInput = document.getElementById("cafeVisibleInput");
const cafeDescInput = document.getElementById("cafeDescInput");
const saveCafe = document.getElementById("saveCafe");
const clearCafe = document.getElementById("clearCafe");
const collectionRows = document.getElementById("collectionRows");
const collectionId = document.getElementById("collectionId");
const collectionTitle = document.getElementById("collectionTitle");
const collectionTag = document.getElementById("collectionTag");
const collectionVisible = document.getElementById("collectionVisible");
const collectionDesc = document.getElementById("collectionDesc");
const saveCollection = document.getElementById("saveCollection");
const clearCollection = document.getElementById("clearCollection");
const galleryRows = document.getElementById("galleryRows");
const galleryId = document.getElementById("galleryId");
const galleryImgPreview = document.getElementById("galleryImgPreview");
const galleryImgThumb = document.getElementById("galleryImgThumb");
const galleryImgNone = document.getElementById("galleryImgNone");
const galleryCameraIn = document.getElementById("galleryCameraIn");
const galleryFileIn = document.getElementById("galleryFileIn");
const galleryImgEdit = document.getElementById("galleryImgEdit");
const galleryImgClear = document.getElementById("galleryImgClear");
let currentGalleryImage = "";
const galleryTitle = document.getElementById("galleryTitle");
const galleryVisible = document.getElementById("galleryVisible");
const galleryCaption = document.getElementById("galleryCaption");
const saveGallery = document.getElementById("saveGallery");
const clearGallery = document.getElementById("clearGallery");
const reviewRows = document.getElementById("reviewRows");

function renderCafeRows(){
  if(!cafeRows) return;
  cafeRows.innerHTML = (DATA.cafes || []).map(item => `
    <div class="adminRow"><div><b>${escapeHtml(item.name)} ${item.visible === false ? "<span class='tag'>HIDDEN</span>" : ""}</b><span>${escapeHtml(item.area)} - ${escapeHtml(item.vibe)} - ${escapeHtml(item.priceTier)} - ${escapeHtml(item.rating)} - ${escapeHtml(item.desc)}</span></div>
    <div class="rowActions"><button class="btn" data-edit-cafe="${escapeHtml(item.id)}">Edit</button><button class="btn" data-toggle-cafe="${escapeHtml(item.id)}">${item.visible === false ? "Show" : "Hide"}</button><button class="btn danger" data-delete-cafe="${escapeHtml(item.id)}">Delete</button></div></div>`).join("");
  cafeRows.querySelectorAll("[data-edit-cafe]").forEach(btn => btn.addEventListener("click", () => editCafe(btn.dataset.editCafe)));
  cafeRows.querySelectorAll("[data-toggle-cafe]").forEach(btn => btn.addEventListener("click", () => { save(data => { const x=data.cafes.find(c=>c.id===btn.dataset.toggleCafe); if(x) x.visible = x.visible === false; }); toastify("Updated", "Cafe card visibility changed."); }));
  cafeRows.querySelectorAll("[data-delete-cafe]").forEach(btn => btn.addEventListener("click", () => { if(!confirm("Delete this cafe card?")) return; save(data => data.cafes = data.cafes.filter(c=>c.id!==btn.dataset.deleteCafe)); toastify("Deleted", "Cafe card removed."); }));
}
function clearCafeForm(){ editingCafeId=""; if(!cafeNameInput) return; cafeId.value=""; cafeNameInput.value=""; cafeAreaInput.value=""; cafeVibeInput.value="traditional"; cafeTierInput.value="$$"; cafeRatingInput.value="4.8"; cafeBadgeInput.value=""; cafeVisibleInput.value="true"; cafeDescInput.value=""; }
function editCafe(id){ const x=(DATA.cafes||[]).find(c=>c.id===id); if(!x) return; editingCafeId=id; cafeId.value=id; cafeNameInput.value=x.name||""; cafeAreaInput.value=x.area||""; cafeVibeInput.value=x.vibe||"traditional"; cafeTierInput.value=x.priceTier||"$$"; cafeRatingInput.value=x.rating||4.8; cafeBadgeInput.value=x.badge||""; cafeVisibleInput.value=String(x.visible!==false); cafeDescInput.value=x.desc||""; }
saveCafe?.addEventListener("click", () => { const payload={id: editingCafeId || CafeStore.uid("cafe"), name:cafeNameInput.value.trim(), area:cafeAreaInput.value.trim(), vibe:cafeVibeInput.value, priceTier:cafeTierInput.value, rating:Number(cafeRatingInput.value||4.5), badge:cafeBadgeInput.value.trim(), visible:cafeVisibleInput.value==="true", desc:cafeDescInput.value.trim()}; if(!payload.name || !payload.desc){ toastify("Missing details", "Add cafe name and description."); return; } save(data=>{ const i=data.cafes.findIndex(x=>x.id===payload.id); if(i>=0) data.cafes[i]=payload; else data.cafes.unshift(payload); }); clearCafeForm(); toastify("Saved", "Cafe finder updated."); });
clearCafe?.addEventListener("click", clearCafeForm);

function renderCollectionRows(){
  if(!collectionRows) return;
  collectionRows.innerHTML=(DATA.collections||[]).map(item=>`<div class="adminRow"><div><b>${escapeHtml(item.title)} ${item.visible===false?"<span class='tag'>HIDDEN</span>":""}</b><span>${escapeHtml(item.tag)} - ${escapeHtml(item.desc)}</span></div><div class="rowActions"><button class="btn" data-edit-collection="${escapeHtml(item.id)}">Edit</button><button class="btn" data-toggle-collection="${escapeHtml(item.id)}">${item.visible===false?"Show":"Hide"}</button><button class="btn danger" data-delete-collection="${escapeHtml(item.id)}">Delete</button></div></div>`).join("");
  collectionRows.querySelectorAll("[data-edit-collection]").forEach(btn=>btn.addEventListener("click",()=>editCollection(btn.dataset.editCollection)));
  collectionRows.querySelectorAll("[data-toggle-collection]").forEach(btn=>btn.addEventListener("click",()=>{ save(data=>{ const x=data.collections.find(c=>c.id===btn.dataset.toggleCollection); if(x) x.visible=x.visible===false; }); toastify("Updated","Collection visibility changed."); }));
  collectionRows.querySelectorAll("[data-delete-collection]").forEach(btn=>btn.addEventListener("click",()=>{ if(!confirm("Delete this collection?")) return; save(data=>data.collections=data.collections.filter(c=>c.id!==btn.dataset.deleteCollection)); toastify("Deleted","Collection removed."); }));
}
function clearCollectionForm(){ editingCollectionId=""; if(!collectionTitle) return; collectionId.value=""; collectionTitle.value=""; collectionTag.value=""; collectionVisible.value="true"; collectionDesc.value=""; }
function editCollection(id){ const x=(DATA.collections||[]).find(c=>c.id===id); if(!x) return; editingCollectionId=id; collectionId.value=id; collectionTitle.value=x.title||""; collectionTag.value=x.tag||""; collectionVisible.value=String(x.visible!==false); collectionDesc.value=x.desc||""; }
saveCollection?.addEventListener("click",()=>{ const payload={id:editingCollectionId||CafeStore.uid("col"), title:collectionTitle.value.trim(), tag:collectionTag.value.trim().toUpperCase(), desc:collectionDesc.value.trim(), visible:collectionVisible.value==="true"}; if(!payload.title||!payload.desc){ toastify("Missing details","Add title and description."); return; } save(data=>{ const i=data.collections.findIndex(x=>x.id===payload.id); if(i>=0) data.collections[i]=payload; else data.collections.unshift(payload); }); clearCollectionForm(); toastify("Saved","Collection updated."); });
clearCollection?.addEventListener("click", clearCollectionForm);

function renderGalleryRows(){
  if(!galleryRows) return;
  galleryRows.innerHTML=(DATA.gallery||[]).map(item=>`<div class="adminRow"><div><b>${item.image?`<img src="${item.image}" class="rowThumb" alt="">`:""} ${escapeHtml(item.title)} ${item.visible===false?"<span class='tag'>HIDDEN</span>":""}</b><span>${escapeHtml(item.caption)}</span></div><div class="rowActions"><button class="btn" data-edit-gallery="${escapeHtml(item.id)}">Edit</button><button class="btn" data-toggle-gallery="${escapeHtml(item.id)}">${item.visible===false?"Show":"Hide"}</button><button class="btn danger" data-delete-gallery="${escapeHtml(item.id)}">Delete</button></div></div>`).join("");
  galleryRows.querySelectorAll("[data-edit-gallery]").forEach(btn=>btn.addEventListener("click",()=>editGallery(btn.dataset.editGallery)));
  galleryRows.querySelectorAll("[data-toggle-gallery]").forEach(btn=>btn.addEventListener("click",()=>{ save(data=>{ const x=data.gallery.find(c=>c.id===btn.dataset.toggleGallery); if(x) x.visible=x.visible===false; }); toastify("Updated","Gallery visibility changed."); }));
  galleryRows.querySelectorAll("[data-delete-gallery]").forEach(btn=>btn.addEventListener("click",()=>{ if(!confirm("Delete this gallery slot?")) return; save(data=>data.gallery=data.gallery.filter(c=>c.id!==btn.dataset.deleteGallery)); toastify("Deleted","Gallery slot removed."); }));
}
async function updateGalleryPreview(previewSrc){
  if(!galleryImgThumb) return;
  if(currentGalleryImage){
    galleryImgThumb.src = previewSrc || await CafeStore.resolveAsset(currentGalleryImage);
    galleryImgThumb.style.display="";
    galleryImgNone.style.display="none";
    if(galleryImgEdit) galleryImgEdit.style.display="";
    galleryImgClear.style.display="";
  } else {
    galleryImgThumb.src="";
    galleryImgThumb.style.display="none";
    galleryImgNone.style.display="";
    if(galleryImgEdit) galleryImgEdit.style.display="none";
    galleryImgClear.style.display="none";
  }
}
function clearGalleryForm(){ editingGalleryId=""; if(!galleryTitle) return; galleryId.value=""; currentGalleryImage=""; updateGalleryPreview(); galleryTitle.value=""; galleryVisible.value="true"; galleryCaption.value=""; }
function editGallery(id){ const x=(DATA.gallery||[]).find(c=>c.id===id); if(!x) return; editingGalleryId=id; galleryId.value=id; currentGalleryImage=x.image||""; updateGalleryPreview(); galleryTitle.value=x.title||""; galleryVisible.value=String(x.visible!==false); galleryCaption.value=x.caption||""; }
saveGallery?.addEventListener("click",()=>{ const payload={id:editingGalleryId||CafeStore.uid("gal"), image:currentGalleryImage, emoji:"", title:galleryTitle.value.trim(), caption:galleryCaption.value.trim(), visible:galleryVisible.value==="true"}; if(!payload.title||!payload.caption){ toastify("Missing details","Add title and caption."); return; } save(data=>{ const i=data.gallery.findIndex(x=>x.id===payload.id); if(i>=0) data.gallery[i]=payload; else data.gallery.unshift(payload); }); clearGalleryForm(); toastify("Saved","Gallery updated."); });
clearGallery?.addEventListener("click", clearGalleryForm);

function handleGalleryFile(file){
  if(!file) return;
  prepareOriginalImage(file)
    .then(({src, preview}) => {
      currentGalleryImage = src;
      updateGalleryPreview(preview);
      toastify("Photo ready", "Original quality kept. Use Edit only if you want to crop.");
    })
    .catch(err => {
      console.error("Gallery image failed:", err);
      toastify("Image failed", "Choose a different photo.");
    });
}
galleryCameraIn?.addEventListener("change", e=>handleGalleryFile(e.target.files[0]));
galleryFileIn?.addEventListener("change", e=>handleGalleryFile(e.target.files[0]));
galleryImgEdit?.addEventListener("click", ()=>editCurrentImage(false));
galleryImgClear?.addEventListener("click", ()=>{ currentGalleryImage=""; updateGalleryPreview(); });

// --- Hero Background Image ---
async function updateHeroImagePreview(previewSrc){
  if(!heroImgThumb) return;
  if(currentHeroImage){
    heroImgThumb.src = previewSrc || await CafeStore.resolveAsset(currentHeroImage);
    heroImgThumb.style.display="";
    heroImgNone.style.display="none";
    if(heroImgEdit) heroImgEdit.style.display="";
    heroImgClear.style.display="";
  } else {
    heroImgThumb.src="";
    heroImgThumb.style.display="none";
    heroImgNone.style.display="";
    if(heroImgEdit) heroImgEdit.style.display="none";
    heroImgClear.style.display="none";
  }
}
function readFileAsDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
async function storeImageDataUrl(dataUrl){
  try{
    return await CafeStore.saveAsset(dataUrl);
  }catch(err){
    console.warn("IndexedDB image storage failed, falling back to inline image:", err);
    return dataUrl;
  }
}
async function prepareOriginalImage(file){
  const dataUrl = await readFileAsDataUrl(file);
  return { src: await storeImageDataUrl(dataUrl), preview: dataUrl };
}
function handleHeroFile(file){
  if(!file) return;
  prepareOriginalImage(file)
    .then(({src, preview}) => {
      currentHeroImage = src;
      updateHeroImagePreview(preview);
      toastify("Photo ready", "Original quality kept. Press Save Settings to publish it.");
    })
    .catch(err => {
      console.error("Hero image failed:", err);
      toastify("Image failed", "Choose a different photo.");
    });
}
heroCameraIn?.addEventListener("change", e=>handleHeroFile(e.target.files[0]));
heroFileIn?.addEventListener("change", e=>handleHeroFile(e.target.files[0]));
heroImgEdit?.addEventListener("click", ()=>editCurrentImage(true));
heroImgClear?.addEventListener("click", ()=>{ currentHeroImage=""; updateHeroImagePreview(); });

// --- Crop overlay ---
const cropOverlay = document.getElementById("cropOverlay");
const cropTitle = document.querySelector(".cropTitle");
const cropImg = document.getElementById("cropImg");
const cropRegion = document.getElementById("cropRegion");
const cropCanvas = document.getElementById("cropCanvas");
const cropConfirmBtn = document.getElementById("cropConfirmBtn");
const cropCancelBtn = document.getElementById("cropCancelBtn");
let cropData = {x:0,y:0,w:0,h:0};
let dragState = null;
let cropImageType = "gallery";

async function editCurrentImage(isHero){
  const image = isHero ? currentHeroImage : currentGalleryImage;
  if(!image){
    toastify("No photo selected", "Choose a photo before editing.");
    return;
  }
  const resolved = await CafeStore.resolveAsset(image);
  openCrop(resolved, isHero);
}

function openCrop(dataUrl, isHero){
  cropImageType = isHero ? "hero" : "gallery";
  if(cropTitle) cropTitle.textContent = isHero ? "Edit Hero Background" : "Edit Gallery Image";
  cropImg.src=dataUrl;
  cropOverlay.style.display="flex";
  cropImg.onload=initCropRegion;
}

function initCropRegion(){
  const iw = cropImg.clientWidth;
  const ih = cropImg.clientHeight;
  if(cropImageType === "hero"){
    const ratio = 16 / 7;
    let w = Math.round(iw * 0.86);
    let h = Math.round(w / ratio);
    if(h > ih * 0.86){
      h = Math.round(ih * 0.86);
      w = Math.round(h * ratio);
    }
    cropData = {x:Math.round((iw-w)/2), y:Math.round((ih-h)/2), w, h};
  } else {
    const s = Math.round(Math.min(iw, ih) * 0.8);
    cropData = {x:Math.round((iw-s)/2), y:Math.round((ih-s)/2), w:s, h:s};
  }
  applyCropRegion();
}

function applyCropRegion(){ cropRegion.style.left=cropData.x+"px"; cropRegion.style.top=cropData.y+"px"; cropRegion.style.width=cropData.w+"px"; cropRegion.style.height=cropData.h+"px"; }

function getCroppedImageDataUrl(sx, sy, sw, sh){
  cropCanvas.width = sw;
  cropCanvas.height = sh;
  cropCanvas.getContext("2d").drawImage(cropImg, sx, sy, sw, sh, 0, 0, sw, sh);
  return cropCanvas.toDataURL("image/jpeg", 0.95);
}

cropRegion?.addEventListener("pointerdown", e=>{ if(e.target.dataset.dir) return; e.preventDefault(); dragState={type:"move",sx:e.clientX,sy:e.clientY,ox:cropData.x,oy:cropData.y}; cropRegion.setPointerCapture(e.pointerId); });

cropRegion?.querySelectorAll("[data-dir]").forEach(h=>{ h.addEventListener("pointerdown", e=>{ e.preventDefault(); e.stopPropagation(); dragState={type:"resize",dir:h.dataset.dir,sx:e.clientX,sy:e.clientY,orig:{...cropData}}; h.setPointerCapture(e.pointerId); }); });

document.addEventListener("pointermove", e=>{ if(!dragState) return; const dx=e.clientX-dragState.sx, dy=e.clientY-dragState.sy; const sw=cropImg.clientWidth, sh=cropImg.clientHeight; if(dragState.type==="move"){ cropData.x=Math.max(0,Math.min(sw-cropData.w,dragState.ox+dx)); cropData.y=Math.max(0,Math.min(sh-cropData.h,dragState.oy+dy)); } else { const {dir,orig}=dragState; let {x,y,w,h}=orig; const mn=40; if(dir.includes("e")) w=Math.max(mn,orig.w+dx); if(dir.includes("s")) h=Math.max(mn,orig.h+dy); if(dir.includes("w")){ const nw=Math.max(mn,orig.w-dx); x=orig.x+(orig.w-nw); w=nw; } if(dir.includes("n")){ const nh=Math.max(mn,orig.h-dy); y=orig.y+(orig.h-nh); h=nh; } if(x<0){w+=x;x=0;} if(y<0){h+=y;y=0;} if(x+w>sw) w=sw-x; if(y+h>sh) h=sh-y; cropData={x,y,w,h}; } applyCropRegion(); });

document.addEventListener("pointerup", ()=>{ dragState=null; });

cropConfirmBtn?.addEventListener("click", async ()=>{ const scX=cropImg.naturalWidth/cropImg.clientWidth, scY=cropImg.naturalHeight/cropImg.clientHeight; const sx=Math.round(cropData.x*scX),sy=Math.round(cropData.y*scY),sw=Math.round(cropData.w*scX),sh=Math.round(cropData.h*scY); const croppedImage=getCroppedImageDataUrl(sx,sy,sw,sh); const storedImage=await storeImageDataUrl(croppedImage); if(cropImageType==="hero"){ currentHeroImage=storedImage; updateHeroImagePreview(croppedImage); } else { currentGalleryImage=storedImage; updateGalleryPreview(croppedImage); } closeCrop(); });

cropCancelBtn?.addEventListener("click", closeCrop);

function closeCrop(){ cropOverlay.style.display="none"; if(galleryCameraIn) galleryCameraIn.value=""; if(galleryFileIn) galleryFileIn.value=""; if(heroCameraIn) heroCameraIn.value=""; if(heroFileIn) heroFileIn.value=""; }

function renderReviewRows(){
  if(!reviewRows) return;
  reviewRows.innerHTML=(DATA.reviews||[]).map(r=>`<div class="adminRow"><div><b>${"*".repeat(Number(r.rating||5))} ${escapeHtml(r.name)} ${r.visible===false?"<span class='tag'>HIDDEN</span>":""}</b><span>${escapeHtml(r.text)}</span></div><div class="rowActions"><button class="btn" data-toggle-review="${escapeHtml(r.id)}">${r.visible===false?"Show":"Hide"}</button><button class="btn danger" data-delete-review="${escapeHtml(r.id)}">Delete</button></div></div>`).join("") || `<div class="fact"><b>No reviews yet</b><p>Customer reviews will appear here.</p></div>`;
  reviewRows.querySelectorAll("[data-toggle-review]").forEach(btn=>btn.addEventListener("click",()=>{ save(data=>{ const x=data.reviews.find(c=>c.id===btn.dataset.toggleReview); if(x) x.visible=x.visible===false; }); toastify("Updated","Review visibility changed."); }));
  reviewRows.querySelectorAll("[data-delete-review]").forEach(btn=>btn.addEventListener("click",()=>{ if(!confirm("Delete this review?")) return; save(data=>data.reviews=data.reviews.filter(c=>c.id!==btn.dataset.deleteReview)); toastify("Deleted","Review removed."); }));
}

function hydrateAssetImages(root=document){
  root.querySelectorAll('img[src^="cafe-asset:"]').forEach(img => {
    CafeStore.resolveAsset(img.getAttribute("src")).then(src => { if(src) img.src = src; });
  });
}

// ===== Category Manager =====
let editingCatId = "";
const categoryRows = document.getElementById("categoryRows");
const catEditId = document.getElementById("catEditId");
const catNameInput = document.getElementById("catNameInput");
const saveCatBtn = document.getElementById("saveCatBtn");
const clearCatBtn = document.getElementById("clearCatBtn");

function slugify(str){ return str.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""); }

function populateMenuCatSelect(){
  const current = menuCat.value;
  menuCat.innerHTML = (DATA.categories || []).map(c => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.label)}</option>`).join("");
  if(menuCat.querySelector(`option[value="${CSS.escape(current)}"]`)) menuCat.value = current;
}

function renderCategoryRows(){
  if(!categoryRows) return;
  const cats = DATA.categories || [];
  if(!cats.length){
    categoryRows.innerHTML = `<div class="fact"><b>No categories yet</b><p>Add a category to organise menu items.</p></div>`;
    return;
  }
  categoryRows.innerHTML = cats.map(c => `
    <div class="adminRow">
      <div>
        <b>${escapeHtml(c.label)}</b>
        <span>Key: ${escapeHtml(c.id)}</span>
      </div>
      <div class="rowActions">
        <button class="btn" data-edit-cat="${escapeHtml(c.id)}">Edit</button>
        <button class="btn danger" data-delete-cat="${escapeHtml(c.id)}">Delete</button>
      </div>
    </div>
  `).join("");
  categoryRows.querySelectorAll("[data-edit-cat]").forEach(btn => btn.addEventListener("click", () => editCat(btn.dataset.editCat)));
  categoryRows.querySelectorAll("[data-delete-cat]").forEach(btn => btn.addEventListener("click", () => deleteCat(btn.dataset.deleteCat)));
}

function clearCatForm(){
  editingCatId = "";
  if(catEditId) catEditId.value = "";
  if(catNameInput) catNameInput.value = "";
  if(saveCatBtn) saveCatBtn.innerHTML = `Save Category`;
}

function editCat(id){
  const c = (DATA.categories || []).find(x => x.id === id);
  if(!c) return;
  editingCatId = id;
  if(catEditId) catEditId.value = id;
  if(catNameInput) catNameInput.value = c.label || "";
  if(saveCatBtn) saveCatBtn.innerHTML = `Update Category`;
  document.getElementById("categoriesPanel")?.scrollIntoView({behavior:"smooth", block:"start"});
}

function deleteCat(id){
  const inUse = DATA.menu.some(x => x.cat === id);
  const msg = inUse
    ? "Menu items use this category. Deleting it won't remove those items, but they'll be uncategorised. Delete anyway?"
    : "Delete this category?";
  if(!confirm(msg)) return;
  save(data => { data.categories = (data.categories || []).filter(c => c.id !== id); });
  toastify("Deleted", "Category removed.");
}

saveCatBtn?.addEventListener("click", () => {
  const label = catNameInput?.value.trim();
  if(!label){ toastify("Missing name", "Enter a category name."); return; }
  const id = editingCatId || slugify(label) || CafeStore.uid("cat");
  if(!editingCatId && (DATA.categories || []).some(c => c.id === id)){
    toastify("Duplicate key", `A category with key "${id}" already exists. Use a different name.`);
    return;
  }
  const payload = { id, label };
  save(data => {
    data.categories = data.categories || [];
    const index = data.categories.findIndex(c => c.id === id);
    if(index >= 0) data.categories[index] = payload;
    else data.categories.push(payload);
  });
  clearCatForm();
  toastify("Saved", "Category updated. Customer tabs updated.");
});
clearCatBtn?.addEventListener("click", clearCatForm);

const oldRenderAllExpanded = renderAll;
renderAll = function(){
  oldRenderAllExpanded();
  DATA = CafeStore.getData();
  renderCafeRows();
  renderCollectionRows();
  renderGalleryRows();
  hydrateAssetImages(galleryRows);
  renderReviewRows();
  renderCategoryRows();
  populateMenuCatSelect();
};
requireLogin();


