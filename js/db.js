// Persistência local: IndexedDB para o diário (com fotos) e localStorage para
// o bar, a lista de compras e as configurações.

const DB_NAME = 'meubar-db';
const DB_VERSION = 1;
let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('entries')) {
        const store = db.createObjectStore('entries', { keyPath: 'id', autoIncrement: true });
        store.createIndex('data', 'data');
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

async function dbAddEntry(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    const req = tx.objectStore('entries').add(entry);
    req.onsuccess = () => resolve(req.result);
    tx.onerror = () => reject(tx.error);
  });
}

async function dbUpdateEntry(entry) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    tx.objectStore('entries').put(entry);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbDeleteEntry(id) {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    tx.objectStore('entries').delete(id);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbClearEntries() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readwrite');
    tx.objectStore('entries').clear();
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function dbGetEntries() {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction('entries', 'readonly');
    const req = tx.objectStore('entries').getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror = () => reject(req.error);
  });
}

// ---- localStorage helpers ----
const LS = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch { return fallback; }
  },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
};

const Store = {
  getBar() { return new Set(LS.get('meubar.bar', [])); },
  setBar(set) { LS.set('meubar.bar', [...set]); },
  getShopping() { return new Set(LS.get('meubar.shopping', [])); },
  setShopping(set) { LS.set('meubar.shopping', [...set]); },
  getApiKey() { return localStorage.getItem('meubar.apikey') || ''; },
  setApiKey(k) { localStorage.setItem('meubar.apikey', k); },
  getPessoas() { return LS.get('meubar.pessoas', []); },
  setPessoas(lista) { LS.set('meubar.pessoas', lista); },
  getFavoritos() { return new Set(LS.get('meubar.favoritos', [])); },
  setFavoritos(set) { LS.set('meubar.favoritos', [...set]); },
  getFesta() { return LS.get('meubar.festa', []); },
  setFesta(ids) { LS.set('meubar.festa', ids); },
  getChat() { return LS.get('meubar.chat', []); },
  setChat(h) { LS.set('meubar.chat', h.slice(-30)); },
  getReceitasCustom() { return LS.get('meubar.receitas', []); },
  setReceitasCustom(lista) { LS.set('meubar.receitas', lista); },
  getLuz() { return LS.get('meubar.luz', 'auto'); },
  setLuz(v) { LS.set('meubar.luz', v); },
  getBoasVindas() { return LS.get('meubar.boasvindas', false); },
  setBoasVindas(v) { LS.set('meubar.boasvindas', v); },
  getHistorias() { return LS.get('meubar.historias', {}); },
  setHistorias(obj) { LS.set('meubar.historias', obj); },
  getNotas() { return LS.get('meubar.notas', {}); },
  setNotas(obj) { LS.set('meubar.notas', obj); },
  // ml ou oz — preferência de quem mede, vale para o app todo
  getUnidade() { return LS.get('meubar.unidade', 'ml'); },
  setUnidade(v) { LS.set('meubar.unidade', v); },
  // Último acesso encerrado, para saber há quanto tempo a pessoa não aparece
  getUltimoAcesso() { return LS.get('meubar.ultimoAcesso', null); },
  setUltimoAcesso(iso) { LS.set('meubar.ultimoAcesso', iso); },
};
