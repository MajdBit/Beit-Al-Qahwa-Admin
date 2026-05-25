
(function(){
  const STORAGE_KEY = "beitAlQahwa.data.v2";
  const ASSET_DB = "beitAlQahwa.assets";
  const ASSET_STORE = "images";
  const ASSET_PREFIX = "cafe-asset:";
  const DEFAULT_PIN = "coffee123";
  const DEFAULT_SOCIAL_LINKS = [
    { id:"instagram", label:"Instagram", icon:"instagram.png", url:"https://instagram.com/", visible:true },
    { id:"facebook", label:"Facebook", icon:"facebook.png", url:"https://facebook.com/", visible:true },
    { id:"whatsapp", label:"WhatsApp", icon:"whatsapp.png", url:"https://wa.me/96100000000", visible:true },
    { id:"tiktok", label:"TikTok", icon:"tiktok.png", url:"https://tiktok.com/", visible:true }
  ];
  const DEFAULT_DATA = {
    ownerPin: DEFAULT_PIN,
    settings: {
      announcement: "",
      brewingHeading: "Now Brewing",
      brewingTitle: "Tonight's house pick",
      brewingBody: "Ask for the rakwe house blend, slow-brewed and served with a small sweet bite.",
      vibeLineInside: "Soft playlist, low-latency calm, classic Beirut concentration.",
      vibeLineOutside: "Street chatter, iced drinks, Lebanon in full color.",
      heroBgImage: "",
      cafeName: "Beit Al-Qahwa",
      area: "Rashaya Al Wadi, West Bekaa",
      phone: "+96100000000",
      whatsapp: "+96100000000",
      instagram: "https://instagram.com/",
      socialLinks: DEFAULT_SOCIAL_LINKS,
      maps: "https://maps.google.com/",
      openHour: "08:00",
      closeHour: "23:00",
      arabicEnabled: true
    },
    categories: [
      { id:"leb", label:"Lebanese" },
      { id:"spec", label:"Specialty" },
      { id:"cold", label:"Cold" }
    ],
    menu: [
      { id:"leb-coffee", cat:"leb", vibe:"traditional", priceTier:"$", badge:"Best seller", name:"Lebanese Coffee", price:"LBP 180k", desc:"Slow-brewed in a rakwe. Strong, honest, impossible to rush.", visible:true },
      { id:"turkish", cat:"leb", vibe:"traditional", priceTier:"$", badge:"Classic", name:"Turkish Coffee", price:"LBP 200k", desc:"Velvety foam, deep roast, served the classic way.", visible:true },
      { id:"white-coffee", cat:"leb", vibe:"calm", priceTier:"$", badge:"Light", name:"White Coffee", price:"LBP 210k", desc:"Orange blossom water, light body, mood reset.", visible:true },
      { id:"espresso", cat:"spec", vibe:"work", priceTier:"$", badge:"Quick shot", name:"Espresso", price:"LBP 190k", desc:"Short shot, tight crema, clean finish.", visible:true },
      { id:"flatwhite", cat:"spec", vibe:"work", priceTier:"$$", badge:"Work-friendly", name:"Flat White", price:"LBP 260k", desc:"Microfoam, balanced intensity, no drama.", visible:true },
      { id:"v60", cat:"spec", vibe:"study", priceTier:"$$$", badge:"Specialty", name:"V60 Pour Over", price:"LBP 320k", desc:"Bright aromatics, controlled extraction, nerd-approved.", visible:true },
      { id:"iced-latte", cat:"cold", vibe:"outdoor", priceTier:"$$", badge:"Summer pick", name:"Iced Latte", price:"LBP 280k", desc:"Cold, smooth, built for street seating.", visible:true },
      { id:"iced-americano", cat:"cold", vibe:"outdoor", priceTier:"$$", badge:"No sugar needed", name:"Iced Americano", price:"LBP 240k", desc:"Crisp, clean, zero sugar dependency.", visible:true }
    ],
    events: [
      { id:"event-1", title:"Poetry Night", meta:"Thursday 8:30 PM - Open mic + featured poet", tag:"THU", visible:true },
      { id:"event-2", title:"Oud Session", meta:"Friday 9:00 PM - Short set, high atmosphere", tag:"FRI", visible:true },
      { id:"event-3", title:"Match Screening", meta:"Saturday 7:00 PM - Big game on, sound moderated", tag:"SAT", visible:true },
      { id:"event-4", title:"Chess Ladder", meta:"Sunday 6:00 PM - Friendly games, steady tension", tag:"SUN", visible:true }
    ],
    cafes: [
      { id:"main", name:"Beit Al-Qahwa", area:"Rashaya", vibe:"traditional", priceTier:"$$", rating:4.8, badge:"House cafe", desc:"Rakwe coffee, local rhythm, and table-first hospitality.", visible:true },
      { id:"study", name:"Quiet Corner", area:"West Bekaa", vibe:"study", priceTier:"$", rating:4.6, badge:"Study pick", desc:"Quiet tables, charging points, and calm playlists.", visible:true },
      { id:"sunset", name:"Sunset Patio", area:"Rashaya", vibe:"outdoor", priceTier:"$$", rating:4.7, badge:"Best view", desc:"Outdoor seating for golden-hour coffee.", visible:true }
    ],
    collections: [
      { id:"winter", title:"Winter cafes in the mountains", desc:"Warm drinks, slow evenings, and mountain-weather comfort.", tag:"SEASONAL", visible:true },
      { id:"study", title:"Study-friendly tables", desc:"Low-noise corners, charging points, and long-stay comfort.", tag:"FOCUS", visible:true },
      { id:"summer", title:"Summer outside seats", desc:"Cold drinks, patio energy, and late-night conversations.", tag:"SUMMER", visible:true }
    ],
    gallery: [
      { id:"g1", title:"Warm interior", caption:"Low light, calm seating, long conversations.", emoji:"", visible:true },
      { id:"g2", title:"Outdoor tables", caption:"Street-view seating for Lebanese evenings.", emoji:"", visible:true },
      { id:"g3", title:"House coffee", caption:"Strong rakwe-style coffee with a clean finish.", emoji:"", visible:true }
    ],
    tables: [
      { id:"W1", label:"Window", seats:2, inside:"available", outside:"available" },
      { id:"W2", label:"Window", seats:2, inside:"busy", outside:"available" },
      { id:"S1", label:"Street view", seats:2, inside:"available", outside:"busy" },
      { id:"S2", label:"Street view", seats:3, inside:"available", outside:"reserved" },
      { id:"Q1", label:"Quiet corner", seats:1, inside:"available", outside:"available" },
      { id:"Q2", label:"Quiet corner", seats:2, inside:"available", outside:"available" },
      { id:"G1", label:"Group", seats:4, inside:"busy", outside:"available" },
      { id:"G2", label:"Group", seats:6, inside:"available", outside:"busy" },
      { id:"B1", label:"Bar", seats:1, inside:"available", outside:"available" },
      { id:"B2", label:"Bar", seats:1, inside:"available", outside:"available" },
      { id:"P1", label:"Patio", seats:3, inside:"available", outside:"busy" },
      { id:"P2", label:"Patio", seats:2, inside:"available", outside:"available" }
    ],
    reviews: [
      { id:"r1", name:"Local guest", rating:5, text:"The kind of coffee spot that turns ten minutes into an hour.", createdAt:"demo", visible:true },
      { id:"r2", name:"Study regular", rating:5, text:"Quiet inside, alive outside. Exactly the right split.", createdAt:"demo", visible:true }
    ],
    reservations: []
  };
  function clone(obj){ return JSON.parse(JSON.stringify(obj)); }
  function uid(prefix="id"){ return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`; }
  function openAssetDb(){
    return new Promise((resolve, reject) => {
      if(!("indexedDB" in window)){
        reject(new Error("IndexedDB is not available."));
        return;
      }
      const req = indexedDB.open(ASSET_DB, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if(!db.objectStoreNames.contains(ASSET_STORE)) db.createObjectStore(ASSET_STORE, { keyPath:"id" });
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  }
  function saveAsset(dataUrl){
    return openAssetDb().then(db => new Promise((resolve, reject) => {
      const id = uid("img");
      const tx = db.transaction(ASSET_STORE, "readwrite");
      tx.objectStore(ASSET_STORE).put({ id, dataUrl, createdAt:new Date().toISOString() });
      tx.oncomplete = () => { db.close(); resolve(ASSET_PREFIX + id); };
      tx.onerror = () => { db.close(); reject(tx.error); };
    }));
  }
  function resolveAsset(src){
    if(!src || !String(src).startsWith(ASSET_PREFIX)) return Promise.resolve(src || "");
    const id = String(src).slice(ASSET_PREFIX.length);
    return openAssetDb().then(db => new Promise((resolve, reject) => {
      const tx = db.transaction(ASSET_STORE, "readonly");
      const req = tx.objectStore(ASSET_STORE).get(id);
      req.onsuccess = () => resolve(req.result?.dataUrl || "");
      req.onerror = () => reject(req.error);
      tx.oncomplete = () => db.close();
    }));
  }
  function isAssetRef(src){ return !!src && String(src).startsWith(ASSET_PREFIX); }
  function mergeArrays(incoming, fallback, normalizer){ return Array.isArray(incoming) ? incoming.map(normalizer) : fallback; }
  function normalizeSocialLinks(incoming, fallback){
    const source = Array.isArray(incoming)
      ? incoming
      : incoming && typeof incoming === "object"
        ? Object.entries(incoming).map(([id, value]) => ({ id, ...(value || {}) }))
        : [];
    return fallback.map(defaultLink => {
      const saved = source.find(link => link && link.id === defaultLink.id) || {};
      return {
        ...defaultLink,
        ...saved,
        id: defaultLink.id,
        label: defaultLink.label,
        icon: defaultLink.icon,
        visible: saved.visible !== false
      };
    });
  }
  function normalize(data){
    const base = clone(DEFAULT_DATA);
    const incoming = data && typeof data === "object" ? data : {};
    const incomingSettings = incoming.settings || {};
    return {
      ...base,
      ...incoming,
      settings: {
        ...base.settings,
        ...incomingSettings,
        socialLinks: normalizeSocialLinks(incomingSettings.socialLinks, base.settings.socialLinks)
      },
      categories: mergeArrays(incoming.categories, base.categories, x => ({ ...x })),
      menu: mergeArrays(incoming.menu, base.menu, x => ({visible:true, vibe:"traditional", priceTier:"$", badge:"", ...x})),
      events: mergeArrays(incoming.events, base.events, x => ({visible:true, ...x})),
      cafes: mergeArrays(incoming.cafes, base.cafes, x => ({visible:true, ...x})),
      collections: mergeArrays(incoming.collections, base.collections, x => ({visible:true, ...x})),
      gallery: mergeArrays(incoming.gallery, base.gallery, x => ({visible:true, ...x})),
      tables: Array.isArray(incoming.tables) ? incoming.tables : base.tables,
      reviews: mergeArrays(incoming.reviews, base.reviews, x => ({visible:true, rating:5, ...x})),
      reservations: Array.isArray(incoming.reservations) ? incoming.reservations : base.reservations
    };
  }
  function getData(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("beitAlQahwa.data.v1");
      if(!raw){ const fresh = clone(DEFAULT_DATA); localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); return fresh; }
      return normalize(JSON.parse(raw));
    }catch(err){ console.warn("Data reset after read error:", err); const fresh = clone(DEFAULT_DATA); localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh)); return fresh; }
  }
  const MODIFIED_KEY = "beitAlQahwa.modified";
  function saveData(data){ const normalized = normalize(data); localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized)); localStorage.setItem(MODIFIED_KEY, Date.now().toString()); window.dispatchEvent(new CustomEvent("cafe:data", { detail: normalized })); return normalized; }
  function updateData(mutator){ const data = getData(); mutator(data); return saveData(data); }
  function resetData(){ return saveData(clone(DEFAULT_DATA)); }
  window.CafeStore = { DEFAULT_PIN, getData, saveData, updateData, resetData, uid, saveAsset, resolveAsset, isAssetRef, STORAGE_KEY, MODIFIED_KEY };
})();


