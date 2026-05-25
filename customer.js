// ===== Customer Website =====
let DATA = CafeStore.getData();
let MODE = "inside";
let activeCat = "all";
let selectedTable = null;
let galleryIndex = 0;
let favorites = JSON.parse(localStorage.getItem("beitAlQahwa.favorites") || "[]");

const yearEl = document.getElementById("year");
const chips = document.querySelectorAll(".chip[data-view]");
const sitInsideBtn = document.getElementById("sitInside");
const sitOutsideBtn = document.getElementById("sitOutside");
const toggleInside = document.getElementById("toggleInside");
const toggleOutside = document.getElementById("toggleOutside");
const modeBadge = document.getElementById("modeBadge");
const sceneElement = document.querySelector(".scene");
const dynamicTitle = document.getElementById("dynamicTitle");
const dynamicDesc  = document.getElementById("dynamicDesc");
const factMode     = document.getElementById("factMode");
const feedTag      = document.getElementById("feedTag");
const quoteBox     = document.getElementById("quoteBox");
const weekTag      = document.getElementById("weekTag");
const vibeLine     = document.getElementById("vibeLine");
const menuList     = document.getElementById("menuList");
const menuCount    = document.getElementById("menuCount");
const menuSearch   = document.getElementById("menuSearch");
const savedList    = document.getElementById("savedList");
const savedCount   = document.getElementById("savedCount");
const menuTabsContainer = document.getElementById("menuTabs");
const eventsList   = document.getElementById("eventsList");
const plan         = document.getElementById("plan");
const selectedBadge= document.getElementById("selectedBadge");
const reserveNote  = document.getElementById("reserveNote");
const planTag      = document.getElementById("planTag");
const planMeta     = document.getElementById("planMeta");
const confirmBtn   = document.getElementById("confirm");
const reservationDateInput = document.getElementById("date");
const reservationTimeInput = document.getElementById("time");
const reservationGuestsInput = document.getElementById("guests");
const modalBack    = document.getElementById("modalBack");
const openModal    = document.getElementById("openModal");
const closeModal   = document.getElementById("closeModal");
const navToggle    = document.getElementById("navToggle");
const primaryNav   = document.getElementById("primaryNav");
const jumpReserve  = document.getElementById("jumpReserve");
const toast        = document.getElementById("toast");
const toastTitle   = document.getElementById("toastTitle");
const toastMsg     = document.getElementById("toastMsg");
const announcementBanner = document.getElementById("announcementBanner");
const announcementText = document.getElementById("announcementText");
const brewingHeading = document.getElementById("brewingHeading");
const brewingTitle = document.getElementById("brewingTitle");
const brewingBody = document.getElementById("brewingBody");
const openStatus = document.getElementById("openStatus");
const cafeSearch = document.getElementById("cafeSearch");
const vibeFilter = document.getElementById("vibeFilter");
const priceFilter = document.getElementById("priceFilter");
const sortFilter = document.getElementById("sortFilter");
const cafeResults = document.getElementById("cafeResults");
const surpriseBtn = document.getElementById("surpriseBtn");
const quizBtn = document.getElementById("quizBtn");
const quizIntent = document.getElementById("quizIntent");
const quizGroup = document.getElementById("quizGroup");
const quizResult = document.getElementById("quizResult");
const collectionsList = document.getElementById("collectionsList");
const galleryFrame = document.getElementById("galleryFrame");
const galleryCount = document.getElementById("galleryCount");
const galleryPrev = document.getElementById("galleryPrev");
const galleryNext = document.getElementById("galleryNext");
const reviewsList = document.getElementById("reviewsList");
const reviewCount = document.getElementById("reviewCount");
const submitReview = document.getElementById("submitReview");
const whatsappLink = document.getElementById("whatsappLink");
const mapsLink = document.getElementById("mapsLink");
const socialLinks = document.getElementById("socialLinks");
const showAllReviewsBtn = document.getElementById("showAllReviewsBtn");
const reviewsActions = document.getElementById("reviewsActions");
let reviewsExpanded = false;

const scrollToId = (id) => { const el = document.querySelector(id); if(el) el.scrollIntoView({ behavior:"smooth", block:"start" }); };
const closeMobileNav = () => {
  primaryNav?.classList.remove("isOpen");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
};
function escapeHtml(value){ return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;"); }
function toastify(title, msg){ toastTitle.textContent = title; toastMsg.textContent = msg; toast.style.display = "block"; toast.style.opacity = "0"; toast.style.transform = "translateY(6px)"; requestAnimationFrame(()=>{ toast.style.transition="opacity .2s ease, transform .2s ease"; toast.style.opacity="1"; toast.style.transform="translateY(0)";}); clearTimeout(window.__toastTimer); window.__toastTimer=setTimeout(()=>{ toast.style.opacity="0"; toast.style.transform="translateY(6px)"; setTimeout(()=>toast.style.display="none",220);},2600); }
function getVisible(list){ return (list || []).filter(item => item.visible !== false); }
function saveFavorites(){ localStorage.setItem("beitAlQahwa.favorites", JSON.stringify(favorites)); }
function isOpenNow(){ const s=DATA.settings||{}; const now=new Date(); const current=String(now.getHours()).padStart(2,"0")+":"+String(now.getMinutes()).padStart(2,"0"); const open=s.openHour||"08:00"; const close=s.closeHour||"23:00"; return open <= close ? current >= open && current <= close : current >= open || current <= close; }
function renderMenuItem(x, i){
  return `
    <div class="item" data-id="${escapeHtml(x.id)}">
      <div class="itemLeft"><div class="cup">${String(i+1).padStart(2,"0")}</div><div><h3>${escapeHtml(x.name)} ${x.badge?`<span class="tag">${escapeHtml(x.badge)}</span>`:""}</h3><p>${escapeHtml(x.desc)}</p></div></div>
      <div class="price">${escapeHtml(x.price)}<br><button class="miniBtn ${favorites.includes(x.id)?"favOn":""}" data-fav="${escapeHtml(x.id)}">${favorites.includes(x.id)?"Saved":"Save"}</button></div>
    </div>`;
}
function bindFavoriteButtons(scope){
  scope.querySelectorAll("[data-fav]").forEach(btn=>btn.addEventListener("click",()=>{ const id=btn.dataset.fav; favorites = favorites.includes(id) ? favorites.filter(x=>x!==id) : [...favorites,id]; saveFavorites(); renderMenu(); renderSavedItems(); toastify("Saved items updated", favorites.includes(id)?"Added to your saved items.":"Removed from saved items."); }));
}

function renderSettings(){
  const s = DATA.settings || {};
  const announcement = (s.announcement || "").trim();
  if(announcement){ announcementText.textContent = announcement; announcementBanner.hidden = false; } else { announcementBanner.hidden = true; }
  if(sceneElement){
    sceneElement.parentElement?.classList.toggle("hasPhoto", !!s.heroBgImage);
    if(s.heroBgImage){
      CafeStore.resolveAsset(s.heroBgImage).then(src => {
        if(!src) return;
        sceneElement.style.backgroundImage = `url('${src}')`;
        sceneElement.style.backgroundSize = "cover";
        sceneElement.style.backgroundPosition = "center";
      }).catch(() => {});
    } else {
      sceneElement.style.backgroundImage = "";
    }
  }
  brewingHeading.textContent = s.brewingHeading || "Now Brewing";
  brewingTitle.textContent = s.brewingTitle || "Tonight's house pick";
  brewingBody.textContent = s.brewingBody || "Ask for the rakwe house blend.";
  if(openStatus){ openStatus.textContent = isOpenNow() ? `OPEN NOW - closes ${s.closeHour || "23:00"}` : `CLOSED - opens ${s.openHour || "08:00"}`; }
  if(whatsappLink){ whatsappLink.href = `https://wa.me/${String(s.whatsapp||"").replace(/\D/g,"")}`; }
  if(mapsLink){ mapsLink.href = s.maps || "https://maps.google.com/"; }
  if(socialLinks){
    const links = (s.socialLinks || []).filter(link => link.visible !== false && link.url);
    socialLinks.hidden = links.length === 0;
    socialLinks.innerHTML = links.map(link => `
      <a href="${escapeHtml(link.url)}" aria-label="${escapeHtml(link.label)}" title="${escapeHtml(link.label)}" target="_blank" rel="noopener">
        <img src="${escapeHtml(link.icon)}" alt="" loading="lazy" />
      </a>
    `).join("");
  }
}
function renderMenuTabs(){
  if(!menuTabsContainer) return;
  const cats = DATA.categories || [];
  menuTabsContainer.innerHTML = `<button class="tab ${activeCat === "all" ? "active" : ""}" data-cat="all">All</button>` +
    cats.map(c => `<button class="tab ${activeCat === c.id ? "active" : ""}" data-cat="${escapeHtml(c.id)}">${escapeHtml(c.label)}</button>`).join("");
  menuTabsContainer.querySelectorAll(".tab").forEach(t => {
    t.addEventListener("click", () => {
      menuTabsContainer.querySelectorAll(".tab").forEach(x => x.classList.remove("active"));
      t.classList.add("active");
      activeCat = t.dataset.cat;
      renderMenu();
    });
  });
}
function renderMenu(){
  const q = (menuSearch.value || "").trim().toLowerCase();
  let items = getVisible(DATA.menu);
  if(activeCat !== "all") items = items.filter(x => x.cat === activeCat);
  if(q) items = items.filter(x => (x.name+" "+x.desc+" "+x.price+" "+(x.badge||"")).toLowerCase().includes(q));
  menuList.innerHTML = items.length ? items.map(renderMenuItem).join("") : `<div class="fact"><b>No items found</b><p>Try another search or category.</p></div>`;
  menuCount.textContent = "ITEMS: " + items.length;
  bindFavoriteButtons(menuList);
}
function renderSavedItems(){
  if(!savedList) return;
  const items = getVisible(DATA.menu).filter(item => favorites.includes(item.id));
  savedList.innerHTML = items.length ? items.map(renderMenuItem).join("") : `<div class="fact"><b>No saved items yet</b><p>Tap Save on any menu item and it will appear here.</p></div>`;
  if(savedCount) savedCount.textContent = "SAVED: " + items.length;
  bindFavoriteButtons(savedList);
}
function renderEvents(){ const events=getVisible(DATA.events); eventsList.innerHTML = events.length ? events.map(e=>`<div class="event"><div><b>${escapeHtml(e.title)}</b><span>${escapeHtml(e.meta)}</span></div><div class="tag">${escapeHtml(e.tag)}</div></div>`).join("") : `<div class="fact"><b>No events listed</b><p>The cafe has not published this week's events yet.</p></div>`; }
function buildTables(){
  const modeKey = MODE === "outside" ? "outside" : "inside";
  const tables = DATA.tables || [];
  plan.innerHTML = tables.map(t=>{ const status=(t[modeKey]||"available").toLowerCase(); const locked=status!=="available"; const selected=selectedTable===t.id; return `<button class="tbl ${locked?"busy":""} ${selected?"selected":""}" data-table="${escapeHtml(t.id)}" ${locked?"disabled":""}><div class="tname">${escapeHtml(t.id)}</div><div class="tmeta">${escapeHtml(t.label)} - ${Number(t.seats||1)} seat${Number(t.seats||1)>1?"s":""}</div><div class="status">${status.toUpperCase()}</div></button>`; }).join("");
  planTag.textContent = MODE.toUpperCase();
  planMeta.textContent = MODE === "outside" ? "Outside mode: street + patio tables spike in demand." : "Inside mode: quiet tables stay open longer, group tables rotate.";
  plan.querySelectorAll(".tbl").forEach(btn=>btn.addEventListener("click",()=>selectTable(btn.dataset.table)));
}
function selectTable(id){ selectedTable=id; selectedBadge.textContent="SELECTED: "+id; reserveNote.textContent="Table "+id+" selected. Confirm to lock it in."; buildTables(); }
const RESERVATION_SLOT_MINUTES = 90;
function getReservationInputs(){
  return {
    date: reservationDateInput?.value || "",
    time: reservationTimeInput?.value || "",
    guests: Number(reservationGuestsInput?.value || 0)
  };
}
function getReservationDateTime(date, time){
  if(!date || !time) return null;
  const reservationDateTime = new Date(`${date}T${time}:00`);
  return Number.isNaN(reservationDateTime.getTime()) ? null : reservationDateTime;
}
function isBlockingReservation(reservation){
  return !["done", "cancelled", "canceled"].includes(String(reservation.status || "new").toLowerCase());
}
function reservationConflicts(tableId, mode, date, time, reservations = DATA.reservations || []){
  const requestedDateTime = getReservationDateTime(date, time);
  if(!tableId || !requestedDateTime) return null;
  return reservations.find(reservation => {
    if(!isBlockingReservation(reservation)) return false;
    if(String(reservation.table) !== String(tableId)) return false;
    if(String(reservation.mode || "inside") !== String(mode)) return false;
    if(String(reservation.date) !== String(date)) return false;
    const existingDateTime = getReservationDateTime(reservation.date, reservation.time);
    if(!existingDateTime) return false;
    return Math.abs(existingDateTime - requestedDateTime) < RESERVATION_SLOT_MINUTES * 60 * 1000;
  }) || null;
}
function clearSelectedTable(message){
  selectedTable = null;
  selectedBadge.textContent = "SELECTED: -";
  reserveNote.textContent = message || "No table selected yet. Pick one above to activate confirmation.";
}
function buildTables(){
  const modeKey = MODE === "outside" ? "outside" : "inside";
  const { date, time } = getReservationInputs();
  const tables = DATA.tables || [];
  if(selectedTable && reservationConflicts(selectedTable, MODE, date, time)) clearSelectedTable("That table is already reserved for this time. Pick another available table.");
  plan.innerHTML = tables.map(t=>{
    const baseStatus = (t[modeKey]||"available").toLowerCase();
    const conflict = reservationConflicts(t.id, MODE, date, time);
    const status = conflict ? "reserved" : baseStatus;
    const locked = status !== "available";
    const selected = selectedTable === t.id;
    return `<button class="tbl ${locked?"busy":""} ${conflict?"reservedNow":""} ${selected?"selected":""}" data-table="${escapeHtml(t.id)}" ${locked?"disabled":""}><div class="tname">${escapeHtml(t.id)}</div><div class="tmeta">${escapeHtml(t.label)} - ${Number(t.seats||1)} seat${Number(t.seats||1)>1?"s":""}</div><div class="status">${escapeHtml(status).toUpperCase()}</div></button>`;
  }).join("");
  planTag.textContent = MODE.toUpperCase();
  planMeta.textContent = MODE === "outside" ? "Outside mode: street + patio tables spike in demand." : "Inside mode: quiet tables stay open longer, group tables rotate.";
  plan.querySelectorAll(".tbl").forEach(btn=>btn.addEventListener("click",()=>selectTable(btn.dataset.table)));
}
function selectTable(id){
  const { date, time } = getReservationInputs();
  if(!date || !time){
    toastify("Choose date and time", "Select when you want to visit first, then pick an available table.");
    return;
  }
  const conflict = reservationConflicts(id, MODE, date, time);
  if(conflict){
    toastify("Table reserved", `Table ${id} is already reserved at ${date} ${time}.`);
    buildTables();
    return;
  }
  selectedTable = id;
  selectedBadge.textContent = "SELECTED: " + id;
  reserveNote.textContent = "Table " + id + " selected for " + date + " at " + time + ".";
  buildTables();
}
function setMode(next, silent=false){
  MODE = next;
  document.body.classList.toggle("modeOutside", MODE==="outside");
  chips.forEach(c=>c.classList.toggle("active", c.dataset.view===MODE));
  sitInsideBtn.classList.toggle("primary", MODE==="inside");
  sitOutsideBtn.classList.toggle("primary", MODE==="outside");
  sitInsideBtn.setAttribute("aria-pressed", MODE==="inside"?"true":"false");
  sitOutsideBtn.setAttribute("aria-pressed", MODE==="outside"?"true":"false");
  toggleInside.classList.toggle("active", MODE==="inside"); toggleOutside.classList.toggle("active", MODE==="outside");
  toggleInside.setAttribute("aria-selected", MODE==="inside"?"true":"false"); toggleOutside.setAttribute("aria-selected", MODE==="outside"?"true":"false");
  modeBadge.textContent="MODE: "+MODE.toUpperCase();
  if(MODE==="inside"){ dynamicTitle.textContent="Inside the Cafe"; dynamicDesc.textContent="Low-volume energy. The place where time forgets to move."; factMode.querySelector("b").textContent="Inside mode"; factMode.querySelector("p").textContent="Lower tempo playlists, calmer lighting, productivity-friendly tables."; feedTag.textContent="INSIDE"; quoteBox.innerHTML=`"Politics tastes better with coffee." <small>Regular, table 4</small>`; weekTag.textContent="INSIDE MODE"; vibeLine.textContent=DATA.settings.vibeLineInside || "Soft playlist, low-latency calm, classic Beirut concentration."; }
  else { dynamicTitle.textContent="Outside the Cafe"; dynamicDesc.textContent="Street energy. People watching becomes a sport."; factMode.querySelector("b").textContent="Outside mode"; factMode.querySelector("p").textContent="Street-view seating, higher tempo, louder laughs, better sunsets."; feedTag.textContent="OUTSIDE"; quoteBox.innerHTML=`"Yalla, one more cup, then we move." <small>Someone who's never moving</small>`; weekTag.textContent="OUTSIDE MODE"; vibeLine.textContent=DATA.settings.vibeLineOutside || "Street chatter, iced drinks, Beirut in full color."; }
  selectedTable=null; selectedBadge.textContent="SELECTED: -"; reserveNote.textContent="No table selected yet. Pick one above to activate confirmation."; buildTables();
  if(!silent) toastify("Mode switched", MODE==="inside"?"Inside mode activated. Quiet energy, strong coffee.":"Outside mode activated. Street vibe, iced lineup.");
}
function renderCafeFinder(){
  if(!cafeResults) return;
  const q=(cafeSearch?.value||"").toLowerCase().trim(); const vibe=vibeFilter?.value||"all"; const price=priceFilter?.value||"all"; const sort=sortFilter?.value||"rating";
  let cafes=getVisible(DATA.cafes);
  if(q) cafes=cafes.filter(c=>(c.name+" "+c.area+" "+c.desc+" "+c.badge).toLowerCase().includes(q));
  if(vibe!=="all") cafes=cafes.filter(c=>c.vibe===vibe); if(price!=="all") cafes=cafes.filter(c=>c.priceTier===price);
  cafes.sort((a,b)=> sort==="rating" ? (b.rating||0)-(a.rating||0) : sort==="price" ? String(a.priceTier).length-String(b.priceTier).length : String(a.name).localeCompare(String(b.name)));
  cafeResults.innerHTML = cafes.length ? cafes.map(c=>`<div class="adminRow"><div><b>${escapeHtml(c.name)} <span class="tag">${escapeHtml(c.badge||c.vibe)}</span></b><p>${escapeHtml(c.area)} - ${escapeHtml(c.priceTier)} - ${escapeHtml(c.rating)}<br>${escapeHtml(c.desc)}</p></div><div class="rowActions"><button class="miniBtn" data-cafe-pick="${escapeHtml(c.id)}">Pick</button></div></div>`).join("") : `<div class="fact"><b>No cafe match</b><p>Try another mood, price tier, or search term.</p></div>`;
  cafeResults.querySelectorAll("[data-cafe-pick]").forEach(btn=>btn.addEventListener("click",()=>{ const c=(DATA.cafes||[]).find(x=>x.id===btn.dataset.cafePick); if(c) toastify("Tonight's pick", `${c.name}: ${c.desc}`); }));
}
function renderCollections(){ if(!collectionsList) return; const list=getVisible(DATA.collections); collectionsList.innerHTML=list.map(c=>`<div class="event"><div><b>${escapeHtml(c.title)}</b><span>${escapeHtml(c.desc)}</span></div><div class="tag">${escapeHtml(c.tag)}</div></div>`).join("") || `<div class="fact"><b>No collections</b><p>Add seasonal collections from the dashboard.</p></div>`; }
function renderGallery(){
  if(!galleryFrame) return;
  const items=getVisible(DATA.gallery);
  if(!items.length){ galleryFrame.innerHTML=`<div><h3>No gallery items</h3><p>Add visual slots from the dashboard.</p></div>`; galleryCount.textContent="0/0"; return; }
  galleryIndex=(galleryIndex+items.length)%items.length;
  const g=items[galleryIndex];
  const immediateSrc = g.image && !CafeStore.isAssetRef(g.image) ? g.image : "";
  const visual=g.image?`<div class="galleryImgWrap"><img class="galleryImg" src="${escapeHtml(immediateSrc)}" data-gallery-image="${escapeHtml(g.image)}" alt="${escapeHtml(g.title)}"></div>`:"";
  galleryFrame.innerHTML=`<div>${visual}<h3>${escapeHtml(g.title)}</h3><p>${escapeHtml(g.caption)}</p></div>`;
  galleryCount.textContent=`${galleryIndex+1}/${items.length}`;
  const img = galleryFrame.querySelector("[data-gallery-image]");
  if(img) CafeStore.resolveAsset(img.dataset.galleryImage).then(src => { if(src) img.src = src; }).catch(() => {});
}

function renderRatingOverview(){
  if(!document.getElementById("scoreNumber")) return;
  const list = getVisible(DATA.reviews);
  if(list.length === 0){
    document.getElementById("scoreNumber").textContent = "-";
    document.getElementById("ratingBar5").querySelector(".fill").style.width = "0%";
    document.getElementById("ratingBar4").querySelector(".fill").style.width = "0%";
    document.getElementById("ratingBar3").querySelector(".fill").style.width = "0%";
    document.getElementById("ratingBar2").querySelector(".fill").style.width = "0%";
    document.getElementById("ratingBar1").querySelector(".fill").style.width = "0%";
    for(let i=1; i<=5; i++) document.getElementById(`count${i}`).textContent = "0 people";
    return;
  }
  const ratingCounts = {1:0, 2:0, 3:0, 4:0, 5:0};
  let totalRating = 0;
  list.forEach(r=>{
    const rating = Number(r.rating || 5);
    ratingCounts[rating]++;
    totalRating += rating;
  });
  const avgRating = (totalRating / list.length).toFixed(1);
  document.getElementById("scoreNumber").textContent = avgRating;
  const maxCount = Math.max(...Object.values(ratingCounts));
  for(let i=5; i>=1; i--){
    const count = ratingCounts[i];
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    document.getElementById(`ratingBar${i}`).querySelector(".fill").style.width = `${percentage}%`;
    document.getElementById(`count${i}`).textContent = `${count} ${count === 1 ? "person" : "people"}`;
  }
}
function renderReviews(){ 
  if(!reviewsList) return; 
  const list=getVisible(DATA.reviews); 
  reviewCount.textContent=`REVIEWS: ${list.length}`; 
  reviewsList.innerHTML=list.map(r=>`<div class="event"><div><b>${"*".repeat(Number(r.rating||5))} ${escapeHtml(r.name)}</b><span>${escapeHtml(r.text)}</span></div><div class="tag">${escapeHtml(r.createdAt==="demo"?"LOCAL":new Date(r.createdAt).toLocaleDateString())}</div></div>`).join("") || `<div class="fact"><b>No reviews yet</b><p>Be the first to write one.</p></div>`; 
  
  // Show/hide the "Show All" button based on review count
  if(list.length > 3){
    reviewsActions.style.display = "block";
    reviewsExpanded = false;
    reviewsList.classList.remove("showAll");
    showAllReviewsBtn.innerHTML = 'Show All Reviews';
  } else {
    reviewsActions.style.display = "none";
  }
  
  renderRatingOverview(); 
}
function runQuiz(){ const vibe=quizIntent.value; const menu=getVisible(DATA.menu).find(m=>m.vibe===vibe) || getVisible(DATA.menu)[0]; const cafe=getVisible(DATA.cafes).find(c=>c.vibe===vibe) || getVisible(DATA.cafes)[0]; const table = vibe==="outdoor" ? "Patio or street-view table" : vibe==="study" || vibe==="work" ? "Quiet corner or window table" : "Window or group table"; quizResult.innerHTML=`<b>${escapeHtml(cafe?.name||"Beit Al-Qahwa")}</b><p>${escapeHtml(quizGroup.value)} plan: ${table}. Recommended order: ${escapeHtml(menu?.name||"Lebanese Coffee")}. ${escapeHtml(cafe?.desc||"")}</p>`; }
function surprise(){ const cafes=getVisible(DATA.cafes); const menu=getVisible(DATA.menu); const c=cafes[Math.floor(Math.random()*cafes.length)]; const m=menu[Math.floor(Math.random()*menu.length)]; if(c&&m) toastify("Surprise plan", `${c.name} + ${m.name}. ${c.badge || "Good choice."}`); }
function refreshFromStore(){ DATA=CafeStore.getData(); renderSettings(); renderMenuTabs(); renderMenu(); renderSavedItems(); renderEvents(); renderCafeFinder(); renderCollections(); renderGallery(); renderReviews(); setMode(MODE,true); }

navToggle?.addEventListener("click", () => {
  const isOpen = primaryNav?.classList.toggle("isOpen");
  navToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
primaryNav?.addEventListener("click", event => {
  if(event.target.closest("button, a")) closeMobileNav();
});
document.addEventListener("keydown", event => {
  if(event.key === "Escape") closeMobileNav();
});
document.querySelectorAll("[data-scroll]").forEach(btn=>btn.addEventListener("click",()=>scrollToId(btn.getAttribute("data-scroll"))));
chips.forEach(c=>c.addEventListener("click",()=>setMode(c.dataset.view)));
sitInsideBtn.addEventListener("click",()=>setMode("inside")); sitOutsideBtn.addEventListener("click",()=>setMode("outside")); toggleInside.addEventListener("click",()=>setMode("inside")); toggleOutside.addEventListener("click",()=>setMode("outside"));
renderMenuTabs();
menuSearch.addEventListener("input", renderMenu);
[reservationDateInput,reservationTimeInput,reservationGuestsInput].forEach(el=>["input","change"].forEach(eventName=>el&&el.addEventListener(eventName,()=>{ DATA=CafeStore.getData(); buildTables(); })));
[cafeSearch,vibeFilter,priceFilter,sortFilter].forEach(el=>el&&el.addEventListener("input",renderCafeFinder));
surpriseBtn?.addEventListener("click", surprise); quizBtn?.addEventListener("click", runQuiz); galleryPrev?.addEventListener("click",()=>{galleryIndex--; renderGallery();}); galleryNext?.addEventListener("click",()=>{galleryIndex++; renderGallery();});
openModal.addEventListener("click",()=>modalBack.style.display="flex"); closeModal.addEventListener("click",()=>modalBack.style.display="none"); modalBack.addEventListener("click",e=>{ if(e.target===modalBack) modalBack.style.display="none"; }); jumpReserve.addEventListener("click",()=>{ modalBack.style.display="none"; scrollToId("#reserve"); });
submitReview?.addEventListener("click",()=>{ const name=(document.getElementById("reviewName").value||"Guest").trim(); const text=(document.getElementById("reviewText").value||"").trim(); const rating=document.getElementById("reviewRating").value; if(!text){ toastify("Review needs text", "Write a short review first."); return; } CafeStore.updateData(data=>{ data.reviews.unshift({id:CafeStore.uid("rev"), name, rating:Number(rating), text, visible:true, createdAt:new Date().toISOString()}); }); document.getElementById("reviewText").value=""; refreshFromStore(); toastify("Review added", "The owner can moderate it from the dashboard."); });
confirmBtn.addEventListener("click", event => {
  if(!selectedTable) return;
  DATA = CafeStore.getData();
  const { date, time } = getReservationInputs();
  const conflict = reservationConflicts(selectedTable, MODE, date, time, DATA.reservations || []);
  if(conflict){
    event.preventDefault();
    event.stopImmediatePropagation();
    clearSelectedTable("That table was just reserved for this time. Pick another available table.");
    buildTables();
    toastify("Table reserved", `Table ${selectedTable || conflict.table} is already reserved at ${date} ${time}.`);
    return;
  }
}, true);
confirmBtn.addEventListener("click",()=>{ if(!selectedTable){ toastify("Select a table", "Pick a table first. Then confirmation activates."); return; } const name=(document.getElementById("name").value||"").trim(); const phone=(document.getElementById("phone").value||"").trim(); const date=document.getElementById("date").value; const time=document.getElementById("time").value; const guests=document.getElementById("guests").value; const note=(document.getElementById("note").value||"").trim(); if(!name){ toastify("Name required", "Please enter your name."); return; } if(!phone){ toastify("Phone required", "Please enter your phone number."); return; } if(!date){ toastify("Date required", "Please select a date."); return; } if(!time){ toastify("Time required", "Please select a time."); return; } if(!guests){ toastify("Guests required", "Please select number of guests."); return; } const now=new Date(); const reservationDateTime=new Date(`${date}T${time}:00`); const diffMinutes=(reservationDateTime-now)/(1000*60); if(diffMinutes<15){ toastify("Time too soon", "Reservations must be at least 15 minutes from now."); return; } CafeStore.updateData(data=>{ data.reservations.unshift({id:CafeStore.uid("res"), name, phone, date, time, guests, note, mode:MODE, table:selectedTable, status:"new", createdAt:new Date().toISOString()}); }); DATA=CafeStore.getData(); toastify("Reservation sent", `${name}: table ${selectedTable}, ${date} at ${time}. The owner can now see it.`); });
showAllReviewsBtn?.addEventListener("click",()=>{ reviewsExpanded = !reviewsExpanded; if(reviewsExpanded){ reviewsList.classList.add("showAll"); showAllReviewsBtn.innerHTML = 'Show Less Reviews'; } else { reviewsList.classList.remove("showAll"); showAllReviewsBtn.innerHTML = 'Show All Reviews'; } });
window.addEventListener("storage", e=>{ if(e.key===CafeStore.STORAGE_KEY || e.key===CafeStore.MODIFIED_KEY) refreshFromStore(); });
window.addEventListener("cafe:data", refreshFromStore);
document.addEventListener("visibilitychange", ()=>{ if(document.visibilityState==="visible") refreshFromStore(); });
let _lastModified = localStorage.getItem(CafeStore.MODIFIED_KEY);
setInterval(()=>{ const m=localStorage.getItem(CafeStore.MODIFIED_KEY); if(m && m!==_lastModified){ _lastModified=m; refreshFromStore(); } }, 1500);
yearEl.textContent = new Date().getFullYear(); refreshFromStore(); setMode("inside", true);


