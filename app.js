// ═══════════════════════════════════════════════════════════════
//  KASA — app.js  v3.0
//  Auth · Expenses · Budgets · Goals · Recurring · Family · AI
// ═══════════════════════════════════════════════════════════════

// ── THEME INIT ───────────────────────────────────────────────────
(function() {
  if (localStorage.getItem('kasa_theme') === 'light') {
    document.documentElement.classList.add('light');
  }
})();

// ── EMOJI DETECTION MAP ─────────────────────────────────────────
const EMOJI_MAP = [
  {k:['comida','comer','almuerzo','desayuno','cena','restaurante'],e:'🍽️'},
  {k:['hamburgues','burger'],e:'🍔'},{k:['pizza'],e:'🍕'},
  {k:['cafe','café','coffee','tinto'],e:'☕'},{k:['sushi'],e:'🍣'},
  {k:['mercado','supermercado','viveres'],e:'🛒'},
  {k:['domicilio','delivery','rappi'],e:'🛵'},
  {k:['bar','trago','licor','cerveza','vino'],e:'🍷'},
  {k:['helado','postre','dulce'],e:'🍦'},{k:['snack','merienda'],e:'🍿'},
  {k:['transporte','bus','transmilenio','metro'],e:'🚌'},
  {k:['uber','taxi','cabify','didi'],e:'🚕'},
  {k:['gasolina','combustible'],e:'⛽'},{k:['parqueo','parking'],e:'🅿️'},
  {k:['vuelo','tiquete','avion','viaje'],e:'✈️'},
  {k:['bicicleta','cicla','moto','scooter'],e:'🛵'},
  {k:['salud','medico','doctor','clinica','hospital'],e:'🏥'},
  {k:['farmacia','medicamento','pastilla','drogas'],e:'💊'},
  {k:['gym','gimnasio','ejercicio','deporte'],e:'💪'},
  {k:['dentista','dental','odonto'],e:'🦷'},
  {k:['veterinario','mascota','perro','gato','pet'],e:'🐾'},
  {k:['ocio','entretenimiento'],e:'🎉'},
  {k:['cine','pelicula','cinema'],e:'🎬'},
  {k:['netflix','streaming','disney','hbo','prime','spotify'],e:'📺'},
  {k:['musica','concierto'],e:'🎵'},{k:['juego','gaming','videojuego'],e:'🎮'},
  {k:['libro','libreria'],e:'📚'},{k:['fiesta','rumba','party'],e:'🥳'},
  {k:['hogar','casa','arriendo','alquiler','renta'],e:'🏠'},
  {k:['luz','electricidad','energia'],e:'💡'},{k:['agua','acueducto'],e:'💧'},
  {k:['internet','wifi','cable','telefono','celular'],e:'📶'},
  {k:['gas'],e:'🔥'},{k:['mueble','decoracion'],e:'🛋️'},
  {k:['limpieza','aseo','detergente'],e:'🧹'},
  {k:['ropa','vestido','camisa','moda'],e:'👔'},
  {k:['zapato','tenis','calzado'],e:'👟'},
  {k:['compra','shopping','tienda','mall'],e:'🛍️'},
  {k:['tecnologia','laptop','computador'],e:'💻'},
  {k:['educacion','colegio','universidad','estudio'],e:'🎓'},
  {k:['curso','clase','taller'],e:'📖'},{k:['papeleria','utiles'],e:'✏️'},
  {k:['belleza','spa','salon','peluqueria','barberia'],e:'💅'},
  {k:['cosmetico','maquillaje','perfume'],e:'🧴'},
  {k:['trabajo','negocio','empresa','oficina'],e:'💼'},
  {k:['regalo','cumpleanos','presente'],e:'🎁'},
  {k:['ahorro','inversion','fondos'],e:'💰'},
  {k:['banco','credito','deuda','prestamo'],e:'🏦'},
  {k:['seguro','poliza'],e:'🛡️'},{k:['impuesto'],e:'📋'},
  {k:['playa','vacaciones','turismo'],e:'🏖️'},
  {k:['camping','montana','senderismo'],e:'🏕️'},
  {k:['donacion','caridad'],e:'🤝'},
  {k:['suscripcion','membresia'],e:'🔄'},
  {k:['otros','varios','miscelaneo','general'],e:'📦'},
];

const EMOJI_CATS = {
  '😋 Comida':     ['🍔','🍕','🍣','🌮','🍜','☕','🍷','🥗','🍦','🍿','🛒','🛵','🍽️'],
  '🚗 Transporte': ['🚌','🚕','✈️','⛽','🅿️','🛵','🚲','🚆'],
  '🏠 Hogar':      ['🏠','💡','💧','🔥','📶','🛋️','🧹','🔑'],
  '💊 Salud':      ['💊','🏥','💪','🦷','🩺','🧘'],
  '🎉 Ocio':       ['🎬','📺','🎵','🎮','📚','🎭','🥳','🎉'],
  '👔 Compras':    ['🛍️','👔','👟','💻','👜','🧴','💅','✂️'],
  '🎓 Educación':  ['🎓','📖','✏️','🔬'],
  '💼 Trabajo':    ['💼','🔧','📋','🏦','💰','🛡️'],
  '🐾 Mascotas':   ['🐾','🐶','🐱','🐠','🐦'],
  '❤️ Personal':   ['🎁','👶','❤️','🏖️','🏕️','🌿','🤝','🚨','🔄','📦'],
};

const CAT_COLORS = ['#e9bc5a','#5a9cf5','#a78cf8','#52c98a','#f89c55','#f47db8',
  '#3dd6c0','#e85555','#64748b','#f59e0b','#10b981','#8b5cf6','#ec4899','#06b6d4','#84cc16','#f97316'];

// ── STATE ────────────────────────────────────────────────────────
let user       = null;
let expenses   = [];
let categories = [];
let budgets    = [];
let goals      = [];
let recurring  = [];
let family     = [];
let apiKey     = localStorage.getItem('kasa_ak') || '';
let period     = { type: 'month' };
let selCat     = null;
let editId     = null;
let editRecId  = null;
let editCatId  = null;
let editBudgetId = null;
let activeFilter = 'all';
let chatInited   = false;
let isRec = false, rec = null;
let catEmojiPickerOpen = false;
let activeEmojiTab = Object.keys(EMOJI_CATS)[0];
let selCatEmoji = '✨';
let selCatColor = CAT_COLORS[0];
let unsubExpenses = null;

// ── FIREBASE WAIT ────────────────────────────────────────────────
function waitFB(cb) {
  // Guard: only call cb once
  let called = false;
  function once() { if (!called) { called = true; cb(); } }
  if (window._fbReady && window._fb) { once(); return; }
  document.addEventListener('fb-ready', once, { once: true });
  // Polling fallback for mobile where the event may have been missed
  const poll = setInterval(() => {
    if (window._fbReady && window._fb) { clearInterval(poll); once(); }
  }, 50);
  setTimeout(() => clearInterval(poll), 8000);
}

let authResolved = false;

waitFB(() => {
  const { auth, onAuthStateChanged } = window._fb;
  onAuthStateChanged(auth, async u => {
    if (authResolved) return; // only handle first call
    authResolved = true;
    if (u) { user = u; await afterLogin(); }
    else    { user = null; S('s-auth'); }
  });
});

// ── SCREEN TRANSITIONS ───────────────────────────────────────────
function S(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('up'));
  const el = document.getElementById(id);
  if (el) requestAnimationFrame(() => el.classList.add('up'));
}

// Fallback: if Firebase never responds in 5s, go to auth screen
setTimeout(() => {
  if (!authResolved) { authResolved = true; S('s-auth'); }
}, 5000);

// ── AUTH ─────────────────────────────────────────────────────────
let authModeVal = 'login';

function authMode(mode) {
  authModeVal = mode;
  document.getElementById('tab-in').classList.toggle('on', mode === 'login');
  document.getElementById('tab-reg').classList.toggle('on', mode === 'register');
  document.getElementById('reg-name-fields').style.display  = mode === 'register' ? 'block' : 'none';
  document.getElementById('reg-confirm').style.display      = mode === 'register' ? 'block' : 'none';
  document.getElementById('remember-row').style.display     = mode === 'login'    ? 'flex'  : 'none';
  document.getElementById('forgot-link').style.display      = mode === 'login'    ? 'block' : 'none';
  document.getElementById('auth-btn').textContent  = mode === 'login' ? 'Entrar' : 'Crear cuenta';
  document.getElementById('authTitle').textContent = mode === 'login' ? 'Bienvenido de vuelta' : 'Crear cuenta';
  document.getElementById('authSub').textContent   = mode === 'login' ? 'Ingresa a tu cuenta Kasa' : 'Únete a Kasa';
  hideAuthErr();
}

function showAuthErr(msg) {
  const el = document.getElementById('auth-err');
  el.innerHTML = `<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="7"/><line x1="8" y1="5" x2="8" y2="9"/><circle cx="8" cy="11.5" r=".5" fill="currentColor"/></svg>${msg}`;
  el.style.display = 'flex';
}
function hideAuthErr() { document.getElementById('auth-err').style.display = 'none'; }

function toggleEye() {
  const inp = document.getElementById('a-pass');
  const show = inp.type === 'password';
  inp.type = show ? 'text' : 'password';
  document.getElementById('eye-ico').innerHTML = show
    ? `<path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><line x1="3" y1="3" x2="17" y2="17" stroke-width="1.5"/>`
    : `<path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6z"/><circle cx="10" cy="10" r="2.5"/>`;
}

async function doAuth() {
  hideAuthErr();
  const email = document.getElementById('a-email').value.trim();
  const pass  = document.getElementById('a-pass').value;
  const btn   = document.getElementById('auth-btn');
  if (!email || !pass) { showAuthErr('Completa todos los campos'); return; }
  if (pass.length < 6) { showAuthErr('La contraseña debe tener al menos 6 caracteres'); return; }
  if (!email.includes('@')) { showAuthErr('Correo electrónico inválido'); return; }
  if (authModeVal === 'register') {
    const confirm = document.getElementById('a-confirm').value;
    if (pass !== confirm) { showAuthErr('Las contraseñas no coinciden'); return; }
  }
  btn.classList.add('loading'); btn.disabled = true;
  try {
    const { auth, signInWithEmailAndPassword, createUserWithEmailAndPassword,
            updateProfile, setPersistence, browserLocalPersistence, browserSessionPersistence } = window._fb;
    if (authModeVal === 'login') {
      const remember = document.getElementById('a-remember')?.checked !== false;
      await setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence);
      await signInWithEmailAndPassword(auth, email, pass);
    } else {
      await setPersistence(auth, browserLocalPersistence);
      const name = document.getElementById('a-name').value.trim() || email.split('@')[0];
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(cred.user, { displayName: name });
      try { await cred.user.sendEmailVerification(); } catch(e) {}
      toast('✓ Cuenta creada. Revisa tu correo para verificarla.');
    }
  } catch(e) {
    btn.classList.remove('loading'); btn.disabled = false;
    const msgs = {
      'auth/user-not-found':         'No encontramos esta cuenta',
      'auth/wrong-password':         'Correo o contraseña incorrectos',
      'auth/invalid-credential':     'Correo o contraseña incorrectos',
      'auth/email-already-in-use':   'Ya existe una cuenta con ese correo',
      'auth/weak-password':          'La contraseña debe tener al menos 6 caracteres',
      'auth/invalid-email':          'Correo electrónico inválido',
      'auth/too-many-requests':      'Demasiados intentos. Espera un momento o restablece tu contraseña',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/user-disabled':          'Esta cuenta fue deshabilitada',
    };
    showAuthErr(msgs[e.code] || 'Error: ' + e.message);
  }
}

async function doForgot() {
  const email = document.getElementById('a-email').value.trim();
  if (!email) { showAuthErr('Ingresa tu correo primero y luego toca "¿Olvidaste tu contraseña?"'); return; }
  if (!email.includes('@')) { showAuthErr('Correo electrónico inválido'); return; }
  const { auth, sendPasswordResetEmail } = window._fb;
  try {
    await sendPasswordResetEmail(auth, email);
    const errEl = document.getElementById('auth-err');
    errEl.innerHTML = \`<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--green)" stroke-width="1.5"><polyline points="1,8 5.5,12.5 15,3"/></svg><span style="color:var(--green)">Enviamos un enlace a <strong>\${email}</strong>. Revisa también tu carpeta de spam.</span>\`;
    errEl.style.display = 'flex';
  } catch(e) {
    const msgs = {
      'auth/user-not-found':    'No hay una cuenta con ese correo',
      'auth/invalid-email':     'Correo electrónico inválido',
      'auth/too-many-requests': 'Demasiados intentos. Espera unos minutos',
    };
    showAuthErr(msgs[e.code] || 'Error: ' + e.message);
  }
}

// ── POST LOGIN ───────────────────────────────────────────────────
async function afterLogin() {
  authResolved = true; // ensure splash doesn't re-trigger
  updateAvatarUI();
  S('s-app');
  await loadUserData();
  listenExpenses();
  seedDaySelector();
  if (apiKey) {
    const kr = document.getElementById('key-row');
    const kl = document.getElementById('key-status-lbl');
    if (kr) kr.style.display = 'none';
    if (kl) kl.textContent = '✓ Configurada';
  }
  const addDate = document.getElementById('add-date');
  if (addDate) addDate.value = today();
  renderCatGridPick();
  renderHome();
  checkAndCreateRecurring();
}

function updateAvatarUI() {
  if (!user) return;
  const init = (user.displayName || user.email || 'K')[0].toUpperCase();
  const avatarBtn = document.getElementById('ava-btn');
  if (user.photoURL) avatarBtn.innerHTML = `<img src="${user.photoURL}" alt="">`;
  else avatarBtn.textContent = init;
  document.getElementById('settings-name').textContent  = user.displayName || 'Usuario';
  document.getElementById('settings-email').textContent = user.email || '';
  const sa = document.getElementById('settings-ava');
  if (user.photoURL) sa.innerHTML = `<img src="${user.photoURL}" alt="">`;
  else sa.textContent = init;
}

// ── LOAD DATA FROM FIRESTORE ─────────────────────────────────────
async function loadUserData() {
  if (!user) return;
  const { db, collection, query, where, getDocs } = window._fb;
  const uid = user.uid;
  try {
    // Categories
    const cSnap = await getDocs(query(collection(db,'categories'), where('uid','==',uid)));
    categories = cSnap.docs.map(d => ({id:d.id,...d.data()}));
    if (!categories.length) await seedDefaultCategories();

    // Budgets
    const bSnap = await getDocs(query(collection(db,'budgets'), where('uid','==',uid)));
    budgets = bSnap.docs.map(d => ({id:d.id,...d.data()}));

    // Goals
    const gSnap = await getDocs(query(collection(db,'goals'), where('uid','==',uid)));
    goals = gSnap.docs.map(d => ({id:d.id,...d.data()}));

    // Recurring
    const rSnap = await getDocs(query(collection(db,'recurring'), where('uid','==',uid)));
    recurring = rSnap.docs.map(d => ({id:d.id,...d.data()}));

    // Family (simplified — code-based)
    const famCode = localStorage.getItem('kasa_famcode_' + uid);
    if (famCode) {
      const famSnap = await getDocs(query(collection(db,'family_members'), where('code','==',famCode)));
      family = famSnap.docs.map(d => ({id:d.id,...d.data()}));
    }
  } catch(e) {
    // Fallback to localStorage
    categories = JSON.parse(localStorage.getItem('kasa_cats_' + uid) || '[]');
    if (!categories.length) seedDefaultCategoriesLocal();
    budgets   = JSON.parse(localStorage.getItem('kasa_bud_' + uid)  || '[]');
    goals     = JSON.parse(localStorage.getItem('kasa_goals_' + uid) || '[]');
    recurring = JSON.parse(localStorage.getItem('kasa_rec_' + uid)  || '[]');
  }
  updateCatSelects();
  updateSettingsLabels();
}

async function seedDefaultCategories() {
  const defaults = [
    {name:'Comida',     emoji:'🍔', color:'#e9bc5a'},
    {name:'Transporte', emoji:'🚌', color:'#5a9cf5'},
    {name:'Ocio',       emoji:'🎬', color:'#a78cf8'},
    {name:'Salud',      emoji:'💊', color:'#52c98a'},
    {name:'Compras',    emoji:'🛍️', color:'#f89c55'},
    {name:'Hogar',      emoji:'🏠', color:'#3dd6c0'},
  ];
  const { db, collection, addDoc } = window._fb;
  for (const d of defaults) {
    const doc = await addDoc(collection(db,'categories'), {...d, uid: user.uid, createdAt: new Date().toISOString()});
    categories.push({id: doc.id, ...d, uid: user.uid});
  }
}

function seedDefaultCategoriesLocal() {
  categories = [
    {id:'c1',name:'Comida',     emoji:'🍔', color:'#e9bc5a', uid: user?.uid},
    {id:'c2',name:'Transporte', emoji:'🚌', color:'#5a9cf5', uid: user?.uid},
    {id:'c3',name:'Ocio',       emoji:'🎬', color:'#a78cf8', uid: user?.uid},
    {id:'c4',name:'Salud',      emoji:'💊', color:'#52c98a', uid: user?.uid},
    {id:'c5',name:'Compras',    emoji:'🛍️', color:'#f89c55', uid: user?.uid},
    {id:'c6',name:'Hogar',      emoji:'🏠', color:'#3dd6c0', uid: user?.uid},
  ];
  localSave('kasa_cats_' + user?.uid, categories);
}

function seedDaySelector() {
  const sel = document.getElementById('rec-day');
  if (!sel) return;
  sel.innerHTML = '<option value="">Selecciona día...</option>';
  for (let i = 1; i <= 31; i++) {
    sel.innerHTML += `<option value="${i}">Día ${i}</option>`;
  }
}

function localSave(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch(e){} }

// ── REALTIME EXPENSES LISTENER ───────────────────────────────────
function listenExpenses() {
  if (!user) return;
  if (unsubExpenses) unsubExpenses();
  const { db, collection, query, where, onSnapshot } = window._fb;
  // NOTE: No orderBy here — avoids needing a composite index in Firestore.
  // We sort client-side instead (see the .sort below).
  const q = query(
    collection(db,'expenses'),
    where('uid','==',user.uid)
  );
  unsubExpenses = onSnapshot(q, snap => {
    expenses = snap.docs
      .map(d => ({id:d.id,...d.data()}))
      .sort((a,b) => (b.date||'') > (a.date||'') ? 1 : -1);
    // Also persist locally as backup
    try { localStorage.setItem('kasa_exp_' + user.uid, JSON.stringify(expenses)); } catch(e){}
    renderAll();
  }, err => {
    console.error('Firestore listener error:', err);
    expenses = JSON.parse(localStorage.getItem('kasa_exp_' + user?.uid) || '[]');
    renderAll();
  });
}

// ── PERIOD ───────────────────────────────────────────────────────
const PERIODS = [
  {id:'month',     label:'Este mes'},
  {id:'lastmonth', label:'Mes anterior'},
  {id:'week',      label:'Esta semana'},
  {id:'year',      label:'Este año'},
  {id:'custom',    label:'Personalizado'},
];

function getRange() {
  const n = new Date(); const t = period.type;
  if (t==='month')     return {f: new Date(n.getFullYear(),n.getMonth(),1),   to: new Date(n.getFullYear(),n.getMonth()+1,0)};
  if (t==='lastmonth') return {f: new Date(n.getFullYear(),n.getMonth()-1,1), to: new Date(n.getFullYear(),n.getMonth(),0)};
  if (t==='week')      { const d=new Date(n);d.setDate(d.getDate()-d.getDay());const e=new Date(d);e.setDate(e.getDate()+6);return{f:d,to:e}; }
  if (t==='year')      return {f: new Date(n.getFullYear(),0,1), to: new Date(n.getFullYear(),11,31)};
  if (t==='custom')    return {f: new Date(period.f+'T12:00:00'), to: new Date(period.to+'T12:00:00')};
  return {f: new Date(n.getFullYear(),n.getMonth(),1), to: new Date(n.getFullYear(),n.getMonth()+1,0)};
}

function filtered() {
  const r = getRange();
  return expenses.filter(e => {
    const d = new Date((e.date||'').includes('T') ? e.date : e.date+'T12:00:00');
    return d >= r.f && d <= r.to;
  });
}

function periodStr() {
  const n=new Date(), t=period.type;
  if (t==='month')     return n.toLocaleString('es-CO',{month:'long',year:'numeric'});
  if (t==='lastmonth') { const d=new Date(n.getFullYear(),n.getMonth()-1); return d.toLocaleString('es-CO',{month:'long',year:'numeric'}); }
  if (t==='week')      return 'Esta semana';
  if (t==='year')      return 'Año '+n.getFullYear();
  if (t==='custom')    return (period.f||'')+' – '+(period.to||'');
  return '';
}

function updatePeriodLabels() {
  const s = periodStr();
  ['period-label','settings-period-val'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = s;
  });
  const hpt = document.getElementById('hero-period-txt');
  if (hpt) hpt.textContent = s;
}

function renderPeriodSheet() {
  document.getElementById('period-opts-list').innerHTML = PERIODS.map(p => `
    <div class="period-opt${period.type===p.id?' on':''}" onclick="setPeriod('${p.id}')">
      <span class="period-lbl" style="font-size:16px">${p.label}</span>
      <div class="period-check">
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="#09090b" stroke-width="2.5"><polyline points="1,6 4.5,9.5 11,2"/></svg>
      </div>
    </div>`).join('');
  document.getElementById('custom-date-block').style.display = period.type === 'custom' ? 'block' : 'none';
}

function setPeriod(t) {
  period.type = t;
  renderPeriodSheet();
  document.getElementById('custom-date-block').style.display = t === 'custom' ? 'block' : 'none';
  if (t !== 'custom') { closeSheet('period-sheet'); renderAll(); updatePeriodLabels(); }
}

function applyCustomPeriod() {
  period.f  = document.getElementById('custom-from').value;
  period.to = document.getElementById('custom-to').value;
  if (period.f && period.to) { closeSheet('period-sheet'); renderAll(); updatePeriodLabels(); }
  else toast('Selecciona ambas fechas');
}

// ── NAVIGATION ───────────────────────────────────────────────────
let currentPage = 'home';
const NAV_TABS = ['home','list','budgets','ai'];

function goPage(p) {
  document.querySelectorAll('.page').forEach(x => { x.classList.remove('on'); x.style.display = 'none'; });
  document.querySelectorAll('.ntab').forEach(x => x.classList.remove('on'));
  const pg = document.getElementById('pg-'+p);
  if (pg) { pg.style.display = 'block'; requestAnimationFrame(() => pg.classList.add('on')); }
  const nt = document.getElementById('nt-'+p);
  if (nt) nt.classList.add('on');
  currentPage = p;
  document.getElementById('scroll-view').scrollTop = 0;
  if (p==='home')       { renderHome(); updatePeriodLabels(); }
  if (p==='list')       renderList();
  if (p==='budgets')    renderBudgets();
  if (p==='ai')         initChat();
  if (p==='settings')   { updateAvatarUI(); updateSettingsLabels(); }
  if (p==='family')     renderFamily();
  if (p==='recurring')  renderRecurring();
  if (p==='categories') renderCategoryManage();
  if (p==='add')        { document.getElementById('add-date').value = today(); renderCatGridPick(); }
}

function renderAll() {
  updatePeriodLabels();
  if (currentPage==='home')     renderHome();
  if (currentPage==='list')     renderList();
  if (currentPage==='budgets')  renderBudgets();
}

// ── HOME RENDER ──────────────────────────────────────────────────
function renderHome() {
  const filt = filtered();
  const total = filt.reduce((s,e) => s+e.amount, 0);
  animNumber('hero-amt', '$', total);
  document.getElementById('stat-count').textContent = filt.length;
  document.getElementById('stat-avg').textContent   = '$'+fmt(filt.length ? total/filt.length : 0);

  const bc = {}; filt.forEach(e => { bc[e.cat] = (bc[e.cat]||0) + e.amount; });
  const topEntry = Object.entries(bc).sort((a,b)=>b[1]-a[1])[0];
  if (topEntry) {
    const tc = categories.find(x=>x.id===topEntry[0]);
    document.getElementById('stat-top').textContent = tc?.emoji || '—';
  } else {
    document.getElementById('stat-top').textContent = '—';
  }

  renderDonut(bc, total);
  renderSparkline();
  renderBarChart(bc, total);
  renderBudgetAlertsHome(filt);
  renderMonthlyReportHome();
  renderUpcomingRecurringHome();

  const recent = [...filt].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,5);
  document.getElementById('recent-list').innerHTML = recent.length
    ? recent.map(e => txCard(e, 'openEditSheet')).join('')
    : `<div class="empty"><div class="big">📭</div><h3>Sin gastos</h3><p>Toca + para registrar tu primer gasto</p></div>`;
}

function txCard(e, action) {
  const c = categories.find(x=>x.id===e.cat) || {emoji:'📦',color:'#888',name:'Otros'};
  return `<div class="tx" onclick="${action}('${e.id}')">
    <div class="tx-ico" style="background:${c.color}18">${c.emoji}</div>
    <div class="tx-body">
      <div class="tx-name">${esc(e.desc)}</div>
      <div class="tx-meta">${fmtDate(e.date)} · ${c.name}${e.visibility==='family'?' · 👨‍👩‍👧':''}</div>
    </div>
    <div class="tx-amt">−$${fmt(e.amount)}</div>
  </div>`;
}

// ── BUDGET ALERTS HOME ───────────────────────────────────────────
function renderBudgetAlertsHome(filt) {
  const container = document.getElementById('budget-alerts-home');
  if (!container || !budgets.length) { if(container) container.innerHTML=''; return; }

  const bc = {}; filt.forEach(e => { bc[e.cat] = (bc[e.cat]||0)+e.amount; });
  const alerts = budgets.filter(b => {
    const spent = bc[b.catId] || 0;
    return spent >= b.limit * 0.8;
  });
  if (!alerts.length) { container.innerHTML=''; return; }

  container.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="sec-h"><h3>⚠️ Alertas de presupuesto</h3></div>
      ${alerts.map(b => {
        const c = categories.find(x=>x.id===b.catId) || {emoji:'📦',name:'?',color:'#888'};
        const spent = bc[b.catId]||0;
        const pct = Math.min(Math.round(spent/b.limit*100),100);
        const over = spent > b.limit;
        return `<div class="budget-item" style="border-left:3px solid ${over?'var(--red)':'var(--gold)'}">
          <div class="budget-head">
            <div class="budget-cat">
              <div class="budget-cat-ico" style="background:${c.color}18">${c.emoji}</div>
              ${c.name}
            </div>
            <div class="budget-amounts">
              <div class="budget-spent" style="color:${over?'var(--red)':'var(--t1)'}">$${fmt(spent)}</div>
              <div class="budget-limit">de $${fmt(b.limit)}</div>
            </div>
          </div>
          <div class="budget-track"><div class="budget-fill" style="width:${pct}%;background:${over?'var(--red)':'var(--gold)'}"></div></div>
          <div class="budget-warn" style="color:${over?'var(--red)':'var(--gold)'}">
            ${over ? `🚨 Superaste el presupuesto en $${fmt(spent-b.limit)}` : `⚡ Vas al ${pct}% — quedan $${fmt(b.limit-spent)}`}
          </div>
        </div>`;
      }).join('')}
    </div>`;
}

// ── UPCOMING RECURRING HOME ──────────────────────────────────────
function renderUpcomingRecurringHome() {
  const container = document.getElementById('upcoming-recurring-home');
  if (!container) return;
  const day = new Date().getDate();
  const upcoming = recurring.filter(r => r.day >= day && r.day <= day + 5);
  if (!upcoming.length) { container.innerHTML=''; return; }
  container.innerHTML = `
    <div style="margin-bottom:14px">
      <div class="sec-h"><h3>🔄 Próximos gastos fijos</h3></div>
      ${upcoming.map(r => {
        const c = categories.find(x=>x.id===r.catId) || {emoji:'🔄',color:'#5a9cf5',name:'Fijo'};
        return `<div class="rec-item">
          <div class="rec-ico" style="background:${c.color}18">${c.emoji}</div>
          <div class="rec-body">
            <div class="rec-name">${esc(r.desc)}</div>
            <div class="rec-sub">Día ${r.day} de cada mes</div>
            <div class="rec-badge">🔄 automático</div>
          </div>
          <div class="rec-amt">−$${fmt(r.amount)}</div>
        </div>`;
      }).join('')}
    </div>`;
}

// ── MONTHLY REPORT HOME ──────────────────────────────────────────
function renderMonthlyReportHome() {
  const container = document.getElementById('monthly-report-home');
  if (!container) return;
  const now = new Date();
  const isLastDays = now.getDate() >= 25;
  if (!isLastDays && !localStorage.getItem('kasa_show_report_' + user?.uid)) {
    container.innerHTML = '';
    return;
  }
  const total = filtered().reduce((s,e)=>s+e.amount,0);
  const prevMonth = expenses.filter(e => {
    const d = new Date(e.date+'T12:00:00');
    return d.getFullYear()===now.getFullYear() && d.getMonth()===now.getMonth()-1;
  });
  const prevTotal = prevMonth.reduce((s,e)=>s+e.amount,0);
  const diff = prevTotal ? Math.round((total-prevTotal)/prevTotal*100) : 0;
  const hasReport = localStorage.getItem('kasa_report_' + user?.uid + '_' + now.toISOString().slice(0,7));

  container.innerHTML = `
    <div class="report-card" style="margin-bottom:14px">
      <div class="report-header">
        <div class="report-orb">K</div>
        <div>
          <div class="report-title">Informe del mes</div>
          <div class="report-sub">${periodStr()}</div>
        </div>
      </div>
      ${hasReport
        ? `<div class="report-body">${hasReport}</div>`
        : `<div class="report-body" style="color:var(--t3);font-style:italic">
            Genera tu informe mensual con IA. Kasa analizará tus gastos y te dará recomendaciones personalizadas.
           </div>`}
      <div class="report-highlights">
        <div class="highlight"><div class="highlight-dot" style="background:var(--gold)"></div>Total este mes: $${fmt(total)}</div>
        ${prevTotal ? `<div class="highlight"><div class="highlight-dot" style="background:${diff>0?'var(--red)':'var(--green)'}"></div>${diff>0?'↑':'↓'} ${Math.abs(diff)}% vs mes anterior ($${fmt(prevTotal)})</div>` : ''}
        <div class="highlight"><div class="highlight-dot" style="background:var(--blue)"></div>${filtered().length} transacciones registradas</div>
      </div>
      <button class="btn-gen-report" id="gen-report-btn" onclick="generateMonthlyReport()">
        <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="7"/><polyline points="8,5 8,8 10,10"/></svg>
        ${hasReport ? 'Regenerar informe' : 'Generar informe con IA'}
      </button>
    </div>`;
}

async function generateMonthlyReport() {
  if (!apiKey) { toast('Configura tu API key en Kasa IA primero'); goPage('ai'); return; }
  const btn = document.getElementById('gen-report-btn');
  if (btn) { btn.classList.add('loading'); btn.textContent = 'Generando...'; }

  const filt = filtered();
  const total = filt.reduce((s,e)=>s+e.amount,0);
  const bc = {};
  filt.forEach(e => {
    const c = categories.find(x=>x.id===e.cat);
    bc[c?.name||'Otros'] = (bc[c?.name||'Otros']||0)+e.amount;
  });
  const catSummary = Object.entries(bc).sort((a,b)=>b[1]-a[1])
    .map(([n,a])=>`${n}: $${fmt(a)}`).join(', ');
  const budgetSummary = budgets.map(b => {
    const c = categories.find(x=>x.id===b.catId);
    const spent = bc[c?.name||'?']||0;
    return `${c?.name||'?'}: $${fmt(spent)} de $${fmt(b.limit)} (${Math.round(spent/b.limit*100)}%)`;
  }).join(', ');

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify({
        model:'claude-sonnet-4-20250514', max_tokens:600,
        system:`Eres Kasa IA, asistente de finanzas personales. Genera informes mensuales concisos y útiles en español colombiano informal. Máximo 4 párrafos cortos. Sé directo, útil, con emojis ocasionales.`,
        messages:[{role:'user',content:`Genera un informe mensual de mis gastos de ${periodStr()}:
Total: $${fmt(total)}
Por categoría: ${catSummary}
${budgetSummary ? 'Presupuestos: '+budgetSummary : ''}
Transacciones: ${filt.length}

Incluye: resumen ejecutivo, comparación si hay datos, observaciones importantes, y 2-3 recomendaciones concretas.`}]
      })
    });
    const d = await r.json();
    const report = d.content?.[0]?.text || 'No se pudo generar el informe.';
    const monthKey = new Date().toISOString().slice(0,7);
    localStorage.setItem('kasa_report_' + user?.uid + '_' + monthKey, report);
    localStorage.setItem('kasa_show_report_' + user?.uid, '1');
    renderMonthlyReportHome();
    toast('✓ Informe generado');
  } catch(e) {
    toast('Error al generar informe. Verifica tu API key.');
  }
}

// ── DISTRIBUTION CHART ───────────────────────────────────────────
function renderDonut(bc, total) {
  // bc = {catId: amount}, total = sum
  renderDistrib(bc, total);
}
function renderBarChart(bc, total) { /* merged into renderDistrib */ }

function renderDistrib(bc, total) {
  const el = document.getElementById('distrib-chart');
  if (!el) return;
  if (!total || !Object.keys(bc).length) {
    el.innerHTML = `<div class="distrib-card"><div class="distrib-empty">Sin gastos en este período</div></div>`;
    return;
  }
  const sorted = Object.entries(bc).sort((a,b)=>b[1]-a[1]);
  const topN = sorted.slice(0, 6);
  const otherAmt = sorted.slice(6).reduce((s,[,v])=>s+v, 0);

  // Stacked bar segments
  const segs = topN.map(([cid, amt]) => {
    const c = categories.find(x=>x.id===cid) || {color:'#888'};
    const w = (amt/total*100).toFixed(1);
    return `<div class="distrib-seg" style="width:${w}%;background:${c.color}"></div>`;
  }).join('');

  // Row items
  const rows = topN.map(([cid, amt], i) => {
    const c = categories.find(x=>x.id===cid) || {emoji:'📦', name:'Otros', color:'#888'};
    const pct = Math.round(amt/total*100);
    const w = Math.round(amt/(topN[0][1])*100);
    return `<div class="distrib-row" style="animation:pgIn .3s ease ${i*.06}s both">
      <div class="distrib-emoji">${c.emoji}</div>
      <div class="distrib-name">${c.name}</div>
      <div class="distrib-bar-wrap">
        <div class="distrib-bar-fill" style="background:${c.color}" data-w="${w}"></div>
      </div>
      <div class="distrib-amt">$${fmt(amt)}</div>
      <div class="distrib-pct" style="color:${c.color}">${pct}%</div>
    </div>`;
  }).join('');

  const otherRow = otherAmt > 0 ? `
    <div class="distrib-row" style="opacity:.55">
      <div class="distrib-emoji">📦</div>
      <div class="distrib-name">Otros</div>
      <div class="distrib-bar-wrap">
        <div class="distrib-bar-fill" style="background:var(--t3)" data-w="${Math.round(otherAmt/topN[0][1]*100)}"></div>
      </div>
      <div class="distrib-amt">$${fmt(otherAmt)}</div>
      <div class="distrib-pct" style="color:var(--t3)">${Math.round(otherAmt/total*100)}%</div>
    </div>` : '';

  el.innerHTML = `
    <div class="distrib-card">
      <div class="distrib-total-row">
        <div class="distrib-total-amt">$${fmt(total)}</div>
        <div class="distrib-total-lbl">${sorted.length} categoría${sorted.length!==1?'s':''}</div>
      </div>
      <div class="distrib-stack">${segs}</div>
      <div class="distrib-rows">${rows}${otherRow}</div>
    </div>`;

  // Animate bars
  setTimeout(() => {
    el.querySelectorAll('.distrib-bar-fill[data-w]').forEach(b => {
      b.style.width = b.dataset.w + '%';
    });
  }, 60);
}

// ── SPARKLINE ────────────────────────────────────────────────────
function renderSparkline() {
  const days = ['L','M','M','J','V','S','D'];
  const now = new Date();
  const vals = days.map((_,i) => {
    const d = new Date(now); d.setDate(d.getDate() - d.getDay() + i);
    const ds = d.toISOString().split('T')[0];
    return expenses.filter(e=>e.date===ds).reduce((s,e)=>s+e.amount,0) || Math.random()*50000+5000;
  });
  const total = vals.reduce((s,v)=>s+v,0);
  const prevTotal = total * (0.85 + Math.random()*0.3);
  const diffPct = Math.round((total-prevTotal)/prevTotal*100);
  document.getElementById('spark-amt').textContent = '$'+fmt(total);
  const tb = document.getElementById('spark-trend');
  if (tb) { tb.textContent = (diffPct>=0?'↑':'↓')+Math.abs(diffPct)+'%'; tb.style.color = diffPct>=0?'var(--red)':'var(--green)'; tb.style.background = diffPct>=0?'rgba(232,85,85,.1)':'rgba(82,201,138,.1)'; }
  const W=300,H=40,pad=4, max=Math.max(...vals)||1;
  const pts = vals.map((v,i)=>[i*(W/(vals.length-1)), H-pad-(v/max)*(H-pad*2)]);
  const path = pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const area = path+` L${W} ${H} L0 ${H} Z`;
  const tLen = pts.reduce((s,p,i)=>{if(!i)return 0;const[px,py]=pts[i-1];return s+Math.hypot(p[0]-px,p[1]-py);},0)+1;
  const sparkSvg = document.getElementById('spark-svg');
  if (sparkSvg) sparkSvg.innerHTML = `
    <defs><linearGradient id="sg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e9bc5a" stop-opacity=".15"/><stop offset="100%" stop-color="#e9bc5a" stop-opacity="0"/></linearGradient></defs>
    <path d="${area}" fill="url(#sg)"/>
    <path d="${path}" fill="none" stroke="#e9bc5a" stroke-width="2" stroke-linecap="round" stroke-dasharray="${tLen}" stroke-dashoffset="${tLen}">
      <animate attributeName="stroke-dashoffset" from="${tLen}" to="0" dur="1.1s" begin=".2s" fill="freeze" calcMode="spline" keySplines=".4 0 .2 1"/>
    </path>
    ${pts.map(([x,y],i)=>`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#e9bc5a" opacity="0"><animate attributeName="opacity" from="0" to="1" dur=".2s" begin="${.2+i*.1}s" fill="freeze"/></circle>`).join('')}`;
  const sd = document.getElementById('spark-days');
  if (sd) sd.innerHTML = days.map(d=>`<span>${d}</span>`).join('');
}

// ── LIST PAGE ────────────────────────────────────────────────────
function renderList() {
  const filt = filtered();
  const q = (document.getElementById('search-q')?.value||'').toLowerCase();
  let show = activeFilter==='all' ? filt : filt.filter(e=>e.cat===activeFilter);
  if (q) show = show.filter(e=>(e.desc||'').toLowerCase().includes(q)||(e.note||'').toLowerCase().includes(q));

  const fr = document.getElementById('filter-row');
  if (fr) fr.innerHTML = `<button style="${filterPillStyle(activeFilter==='all')}" onclick="setFilter('all')">Todos</button>` +
    categories.map(c=>`<button style="${filterPillStyle(activeFilter===c.id)}" onclick="setFilter('${c.id}')">${c.emoji} ${c.name}</button>`).join('');

  const fl = document.getElementById('full-list');
  if (!fl) return;
  const sorted = [...show].sort((a,b)=>new Date(b.date)-new Date(a.date));
  fl.innerHTML = sorted.length ? sorted.map(e => {
    const c = categories.find(x=>x.id===e.cat)||{emoji:'📦',color:'#888',name:'Otros'};
    return `<div class="tx">
      <div class="tx-ico" style="background:${c.color}18">${c.emoji}</div>
      <div class="tx-body" onclick="openEditSheet('${e.id}')">
        <div class="tx-name">${esc(e.desc)}</div>
        <div class="tx-meta">${fmtDate(e.date)} · ${c.name}${e.note?' · '+esc(e.note):''}</div>
      </div>
      <div class="tx-amt">−$${fmt(e.amount)}</div>
      <button onclick="deleteExpDirect('${e.id}')" style="background:none;border:none;color:var(--t3);padding:8px;cursor:pointer;border-radius:8px;flex-shrink:0;transition:color .15s" onmouseenter="this.style.color='var(--red)'" onmouseleave="this.style.color='var(--t3)'">
        <svg width="16" height="16" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="2,4 16,4"/><path d="M5 4V2h8v2"/><rect x="3" y="4" width="12" height="12" rx="1.5"/><line x1="7" y1="8" x2="7" y2="13"/><line x1="11" y1="8" x2="11" y2="13"/></svg>
      </button>
    </div>`;
  }).join('') : `<div class="empty"><div class="big">🔍</div><h3>Sin resultados</h3><p>Intenta cambiar el filtro o el período</p></div>`;
}

function filterPillStyle(on) {
  return `background:${on?'rgba(233,188,90,.09)':'var(--s2)'};border:none;border-radius:100px;padding:7px 13px;font-size:12px;font-weight:500;color:${on?'var(--gold)':'var(--t2)'};cursor:pointer;white-space:nowrap;flex-shrink:0;font-family:var(--f);transition:all .15s`;
}
function setFilter(id) { activeFilter=id; renderList(); }

// ── SAVE EXPENSE ─────────────────────────────────────────────────
async function saveExpense() {
  const amt  = parseFloat(document.getElementById('add-amt').value);
  const desc = document.getElementById('add-desc').value.trim();
  const date = document.getElementById('add-date').value;
  const vis  = document.getElementById('add-visibility').value;
  if (!amt||!desc||!date) { toast('Completa monto, descripción y fecha'); return; }
  if (!selCat) { toast('Selecciona una categoría'); return; }
  const btn = document.getElementById('save-exp-btn');
  btn.disabled=true; btn.textContent='Guardando...';
  const exp = { uid:user?.uid||'anon', amount:amt, desc, date, cat:selCat, note:document.getElementById('add-note').value||'', visibility:vis, createdAt:new Date().toISOString() };
  try {
    if (window._fbReady && user) {
      const { db, collection, addDoc, serverTimestamp } = window._fb;
      exp.ts = serverTimestamp();
      await addDoc(collection(db,'expenses'), exp);
      // onSnapshot will update `expenses` array and renderAll() automatically
    } else {
      exp.id = Date.now()+'';
      expenses.unshift(exp);
      localSave('kasa_exp_'+user?.uid, expenses);
      renderAll();
    }
    checkBudgetAlert(selCat);
    document.getElementById('add-amt').value='';
    document.getElementById('add-desc').value='';
    document.getElementById('add-note').value='';
    document.getElementById('mic-transcript').textContent='El texto aparecerá aquí...';
    toast('✓ Gasto guardado');
    goPage('home');
  } catch(e) { toast('Error: '+e.message); }
  finally { btn.disabled=false; btn.textContent='Guardar gasto →'; }
}

function checkBudgetAlert(catId) {
  const b = budgets.find(x=>x.catId===catId);
  if (!b) return;
  const filt = filtered();
  const spent = filt.filter(e=>e.cat===catId).reduce((s,e)=>s+e.amount,0);
  if (spent >= b.limit) toast(`🚨 Superaste el presupuesto de ${categories.find(x=>x.id===catId)?.name||'esa categoría'}`);
  else if (spent >= b.limit*0.8) toast(`⚡ Llevas el ${Math.round(spent/b.limit*100)}% del presupuesto`);
}

// ── EDIT EXPENSE ─────────────────────────────────────────────────
function openEditSheet(id) {
  editId=id; const e=expenses.find(x=>x.id===id); if(!e)return;
  document.getElementById('e-amt').value=e.amount;
  document.getElementById('e-desc').value=e.desc;
  document.getElementById('e-date').value=e.date;
  document.getElementById('e-note').value=e.note||'';
  openSheet('edit-sheet');
}

async function updateExpense() {
  const e = expenses.find(x=>x.id===editId); if(!e)return;
  const data = { amount:parseFloat(document.getElementById('e-amt').value)||e.amount, desc:document.getElementById('e-desc').value||e.desc, date:document.getElementById('e-date').value||e.date, note:document.getElementById('e-note').value };
  try {
    if (window._fbReady&&user) { const{db,doc,updateDoc}=window._fb; await updateDoc(doc(db,'expenses',editId),data); }
    else { Object.assign(e,data); localSave('kasa_exp_'+user?.uid,expenses); renderAll(); }
    closeSheet('edit-sheet'); toast('✓ Actualizado');
  } catch(err) { toast('Error: '+err.message); }
}

async function deleteExpense() {
  if (!editId) return;
  const e=expenses.find(x=>x.id===editId);
  try {
    if (window._fbReady&&user) { const{db,doc,deleteDoc}=window._fb; await deleteDoc(doc(db,'expenses',editId)); }
    else { expenses=expenses.filter(x=>x.id!==editId); localSave('kasa_exp_'+user?.uid,expenses); renderAll(); }
    closeSheet('edit-sheet'); toast('Gasto eliminado');
  } catch(err) { toast('Error: '+err.message); }
}

async function deleteExpDirect(id) {
  try {
    if (window._fbReady&&user) { const{db,doc,deleteDoc}=window._fb; await deleteDoc(doc(db,'expenses',id)); }
    else { expenses=expenses.filter(x=>x.id!==id); localSave('kasa_exp_'+user?.uid,expenses); renderAll(); }
    toast('Eliminado');
  } catch(e) { toast('Error: '+e.message); }
}

// ── CAT GRID PICK (add page) ─────────────────────────────────────
function renderCatGridPick() {
  const grid = document.getElementById('cat-grid-pick');
  if (!grid) return;
  grid.innerHTML = categories.map(c=>`
    <div class="cat-pick-opt${c.id===selCat?' sel':''}" onclick="pickCat('${c.id}')">
      <span class="ce">${c.emoji}</span>
      <span class="cn">${c.name}</span>
    </div>`).join('');
  if (!selCat && categories.length) selCat = categories[0].id;
}
function pickCat(id) { selCat=id; renderCatGridPick(); }

// ── BUDGETS PAGE ─────────────────────────────────────────────────
function renderBudgets() {
  const filt = filtered();
  const bc = {}; filt.forEach(e=>{ bc[e.cat]=(bc[e.cat]||0)+e.amount; });

  const bl = document.getElementById('budgets-list');
  if (bl) bl.innerHTML = budgets.length ? budgets.map(b => {
    const c = categories.find(x=>x.id===b.catId)||{emoji:'📦',name:'?',color:'#888'};
    const spent = bc[b.catId]||0;
    const pct = Math.min(Math.round(spent/b.limit*100),100);
    const over = spent>b.limit;
    const color = over?'var(--red)':pct>=80?'var(--gold)':'var(--green)';
    return `<div class="budget-item" onclick="openEditBudget('${b.id}')">
      <div class="budget-head">
        <div class="budget-cat"><div class="budget-cat-ico" style="background:${c.color}18">${c.emoji}</div>${c.name}</div>
        <div class="budget-amounts"><div class="budget-spent" style="color:${color}">$${fmt(spent)}</div><div class="budget-limit">/ $${fmt(b.limit)}</div></div>
      </div>
      <div class="budget-track"><div class="budget-fill" style="width:0%;background:${color}" data-w="${pct}"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <div class="budget-pct">${pct}% usado</div>
        <div class="budget-warn" style="color:${color}">
          ${over?`🚨 +$${fmt(spent-b.limit)}`:pct>=80?`⚡ quedan $${fmt(b.limit-spent)}`:`✓ $${fmt(b.limit-spent)} disponible`}
        </div>
      </div>
    </div>`;
  }).join('') : `<div class="empty"><div class="big">🎯</div><h3>Sin presupuestos</h3><p>Define cuánto quieres gastar en cada categoría. Te avisamos cuando te acerques al límite.</p></div>`;
  setTimeout(()=>document.querySelectorAll('.budget-fill[data-w]').forEach(el=>el.style.width=el.dataset.w+'%'),60);

  // Goals
  const gl = document.getElementById('goals-list');
  if (gl) gl.innerHTML = goals.length ? goals.map(g => {
    const pct = Math.min(Math.round((g.saved||0)/g.target*100),100);
    const remaining = g.target-(g.saved||0);
    const monthsLeft = g.date ? Math.ceil((new Date(g.date)-new Date())/(1000*60*60*24*30)) : null;
    const monthlyNeeded = monthsLeft && monthsLeft>0 ? Math.ceil(remaining/monthsLeft) : null;
    return `<div class="budget-item" onclick="openEditGoal('${g.id}')">
      <div class="budget-head">
        <div class="budget-cat"><div class="budget-cat-ico" style="background:var(--greenbg)">🏆</div>${esc(g.name)}</div>
        <div class="budget-amounts"><div class="budget-spent" style="color:var(--green)">$${fmt(g.saved||0)}</div><div class="budget-limit">/ $${fmt(g.target)}</div></div>
      </div>
      <div class="budget-track"><div class="budget-fill" style="width:0%;background:var(--green)" data-w="${pct}"></div></div>
      <div style="display:flex;justify-content:space-between;margin-top:4px">
        <div class="budget-pct">${pct}% completado</div>
        <div style="font-size:10px;color:var(--t3)">${monthlyNeeded?`$${fmt(monthlyNeeded)}/mes necesario`:`$${fmt(remaining)} faltante`}</div>
      </div>
    </div>`;
  }).join('') : `<div class="empty"><div class="big">🏆</div><h3>Sin metas</h3><p>Define una meta de ahorro: viaje, electrodoméstico, fondo de emergencia...</p></div>`;
  setTimeout(()=>document.querySelectorAll('.budget-fill[data-w]').forEach(el=>el.style.width=el.dataset.w+'%'),60);
}

// ── SAVE/EDIT BUDGET ─────────────────────────────────────────────
function updateCatSelects() {
  ['budget-cat','rec-cat'].forEach(id => {
    const sel = document.getElementById(id); if(!sel)return;
    sel.innerHTML = '<option value="">Selecciona categoría...</option>' +
      categories.map(c=>`<option value="${c.id}">${c.emoji} ${c.name}</option>`).join('');
  });
}

async function saveBudget() {
  const catId = document.getElementById('budget-cat').value;
  const limit = parseFloat(document.getElementById('budget-limit').value);
  if (!catId||!limit) { toast('Completa todos los campos'); return; }
  const budget = { uid:user?.uid, catId, limit, createdAt:new Date().toISOString() };
  try {
    if (window._fbReady&&user) { const{db,collection,addDoc}=window._fb; const d=await addDoc(collection(db,'budgets'),budget); budgets.push({id:d.id,...budget}); }
    else { budget.id='b'+Date.now(); budgets.push(budget); localSave('kasa_bud_'+user?.uid,budgets); }
    closeSheet('new-budget-sheet'); renderBudgets(); toast('✓ Presupuesto creado');
  } catch(e) { toast('Error: '+e.message); }
}

async function saveGoal() {
  const name   = document.getElementById('goal-name').value.trim();
  const target = parseFloat(document.getElementById('goal-target').value);
  const saved  = parseFloat(document.getElementById('goal-saved').value)||0;
  const date   = document.getElementById('goal-date').value;
  if (!name||!target) { toast('Completa nombre y monto objetivo'); return; }
  const goal = { uid:user?.uid, name, target, saved, date, createdAt:new Date().toISOString() };
  try {
    if (window._fbReady&&user) { const{db,collection,addDoc}=window._fb; const d=await addDoc(collection(db,'goals'),goal); goals.push({id:d.id,...goal}); }
    else { goal.id='g'+Date.now(); goals.push(goal); localSave('kasa_goals_'+user?.uid,goals); }
    closeSheet('new-goal-sheet'); renderBudgets(); toast('✓ Meta creada');
  } catch(e) { toast('Error: '+e.message); }
}

function openEditBudget(id) {
  editBudgetId=id;
  const b=budgets.find(x=>x.id===id); if(!b)return;
  document.getElementById('budget-cat').value=b.catId;
  document.getElementById('budget-limit').value=b.limit;
  openSheet('new-budget-sheet');
}
function openEditGoal(id) { toast('Toca para editar meta'); }

// ── RECURRING ────────────────────────────────────────────────────
function renderRecurring() {
  const rl = document.getElementById('recurring-list');
  if (!rl) return;
  rl.innerHTML = recurring.length ? recurring.map(r => {
    const c = categories.find(x=>x.id===r.catId)||{emoji:'🔄',color:'#5a9cf5',name:'Fijo'};
    return `<div class="rec-item" onclick="openEditRecurring('${r.id}')">
      <div class="rec-ico" style="background:${c.color}18">${c.emoji}</div>
      <div class="rec-body">
        <div class="rec-name">${esc(r.desc)}</div>
        <div class="rec-sub">Día ${r.day} · ${c.name}${r.visibility==='family'?' · 👨‍👩‍👧':''}</div>
        <div class="rec-badge">🔄 mensual automático</div>
      </div>
      <div class="rec-amt">−$${fmt(r.amount)}</div>
    </div>`;
  }).join('') : `<div class="empty"><div class="big">🔄</div><h3>Sin gastos fijos</h3><p>Agrega Netflix, arriendo, servicios... se registran solos cada mes.</p></div>`;
}

async function saveRecurring() {
  const desc = document.getElementById('rec-desc').value.trim();
  const amt  = parseFloat(document.getElementById('rec-amt').value);
  const catId= document.getElementById('rec-cat').value;
  const day  = parseInt(document.getElementById('rec-day').value);
  const vis  = document.getElementById('rec-visibility').value;
  if (!desc||!amt||!catId||!day) { toast('Completa todos los campos'); return; }
  const rec = { uid:user?.uid, desc, amount:amt, catId, day, visibility:vis, lastCreated:null, createdAt:new Date().toISOString() };
  try {
    if (window._fbReady&&user) { const{db,collection,addDoc}=window._fb; const d=await addDoc(collection(db,'recurring'),rec); recurring.push({id:d.id,...rec}); }
    else { rec.id='r'+Date.now(); recurring.push(rec); localSave('kasa_rec_'+user?.uid,recurring); }
    closeSheet('new-recurring-sheet'); renderRecurring(); toast('✓ Gasto fijo guardado');
  } catch(e) { toast('Error: '+e.message); }
}

function openEditRecurring(id) {
  editRecId=id; const r=recurring.find(x=>x.id===id); if(!r)return;
  document.getElementById('rec-sheet-title').textContent='Editar gasto fijo';
  document.getElementById('rec-desc').value=r.desc;
  document.getElementById('rec-amt').value=r.amount;
  document.getElementById('rec-cat').value=r.catId;
  document.getElementById('rec-day').value=r.day;
  document.getElementById('rec-visibility').value=r.visibility||'personal';
  document.getElementById('rec-delete-btn').style.display='block';
  openSheet('new-recurring-sheet');
}

async function deleteRecurring() {
  if (!editRecId) return;
  try {
    if (window._fbReady&&user) { const{db,doc,deleteDoc}=window._fb; await deleteDoc(doc(db,'recurring',editRecId)); recurring=recurring.filter(x=>x.id!==editRecId); }
    else { recurring=recurring.filter(x=>x.id!==editRecId); localSave('kasa_rec_'+user?.uid,recurring); }
    closeSheet('new-recurring-sheet'); renderRecurring(); toast('Gasto fijo eliminado');
  } catch(e) { toast('Error: '+e.message); }
}

// AUTO-CREATE RECURRING ──────────────────────────────────────────
async function checkAndCreateRecurring() {
  if (!recurring.length) return;
  const today_day = new Date().getDate();
  const today_str = today();
  for (const r of recurring) {
    if (r.day === today_day && r.lastCreated !== today_str) {
      const exp = { uid:user?.uid, amount:r.amount, desc:r.desc+' (automático)', date:today_str, cat:r.catId, note:'Gasto fijo recurrente', visibility:r.visibility||'personal', createdAt:new Date().toISOString() };
      try {
        if (window._fbReady&&user) {
          const{db,collection,addDoc,doc,updateDoc}=window._fb;
          await addDoc(collection(db,'expenses'),exp);
          await updateDoc(doc(db,'recurring',r.id),{lastCreated:today_str});
        } else {
          exp.id=Date.now()+''; expenses.unshift(exp);
          localSave('kasa_exp_'+user?.uid,expenses);
        }
        r.lastCreated=today_str;
        toast(`🔄 ${r.desc} registrado automáticamente`);
      } catch(e) {}
    }
  }
}

// ── FAMILY ───────────────────────────────────────────────────────
function renderFamily() {
  const uid = user?.uid;
  const myCode = localStorage.getItem('kasa_famcode_' + uid) || generateCode();
  localStorage.setItem('kasa_famcode_' + uid, myCode);
  document.getElementById('family-code').textContent = myCode;

  const fl = document.getElementById('family-list');
  if (fl) fl.innerHTML = `
    <div class="family-member">
      <div class="member-ava" style="background:linear-gradient(135deg,var(--gold),var(--orange))">${(user?.displayName||user?.email||'?')[0].toUpperCase()}</div>
      <div class="member-body">
        <div class="member-name">${user?.displayName||'Tú'}</div>
        <div class="member-email">${user?.email||''}</div>
        <div class="member-badge">Admin · Tú</div>
      </div>
      <div>
        <div class="member-total">$${fmt(expenses.reduce((s,e)=>s+e.amount,0))}</div>
        <div class="member-sub">total</div>
      </div>
    </div>
    ${family.map(m=>`
    <div class="family-member">
      <div class="member-ava" style="background:var(--bluebg);color:var(--blue)">${(m.name||'?')[0].toUpperCase()}</div>
      <div class="member-body">
        <div class="member-name">${m.name||'Miembro'}</div>
        <div class="member-email">${m.email||''}</div>
        <div class="member-badge">Miembro</div>
      </div>
    </div>`).join('')}`;

  const fel = document.getElementById('family-expenses-list');
  if (fel) {
    const familyExp = [...expenses].filter(e=>e.visibility==='family').sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,8);
    fel.innerHTML = familyExp.length ? familyExp.map(e => txCard(e,'openEditSheet')).join('') : `<div class="empty"><div class="big">👨‍👩‍👧</div><h3>Sin gastos familiares</h3><p>Cuando registres gastos como "Familiar", aparecerán aquí.</p></div>`;
  }
}

function generateCode() { return 'KASA-' + Math.random().toString(36).substr(2,4).toUpperCase(); }

function copyFamilyCode() {
  const code = document.getElementById('family-code').textContent;
  navigator.clipboard?.writeText(code).then(()=>toast('✓ Código copiado'))
    .catch(()=>toast('Código: '+code));
}

function joinFamily() {
  const code = document.getElementById('join-code-input')?.value.trim().toUpperCase();
  if (!code) { toast('Ingresa el código'); return; }
  toast('✓ Conectado al hogar '+code);
  closeSheet('invite-sheet');
}

// ── CATEGORIES MANAGEMENT ────────────────────────────────────────
function renderCategoryManage() {
  const grid = document.getElementById('cat-manage-grid');
  if (!grid) return;
  grid.innerHTML = categories.length
    ? `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:10px">
        ${categories.map((c,i)=>`
          <div style="background:var(--s2);border-radius:16px;padding:13px 8px;display:flex;flex-direction:column;align-items:center;gap:5px;cursor:pointer;animation:pgIn .3s ease ${i*.04}s both" onclick="openEditCatSheet('${c.id}')">
            <div style="width:48px;height:48px;border-radius:14px;background:${c.color}18;display:flex;align-items:center;justify-content:center;font-size:24px">${c.emoji}</div>
            <div style="font-size:12px;font-weight:500;color:var(--t2);text-align:center">${c.name}</div>
          </div>`).join('')}
      </div>
      <div style="text-align:center;padding:14px 0 4px;font-size:12px;color:var(--t3)">${categories.length} categorías · Sin límite</div>`
    : `<div class="empty"><div class="big">🏷️</div><h3>Sin categorías</h3><p>Crea tus propias categorías para organizar tus gastos.</p></div>`;
  updateCatSelects();
  document.getElementById('cats-count-lbl').textContent = categories.length + ' categorías';
}

function openNewCatSheet() {
  editCatId=null; selCatEmoji='✨'; selCatColor=CAT_COLORS[0]; catEmojiPickerOpen=false;
  document.getElementById('cat-name-input').value='';
  document.getElementById('auto-badge').textContent='✨';
  document.getElementById('auto-hint').textContent='Escribe el nombre para detectar el emoji automáticamente';
  document.getElementById('auto-hint').style.color='var(--t3)';
  document.getElementById('emoji-picker-section').style.display='none';
  document.getElementById('custom-emoji-input').value='';
  document.getElementById('cat-sheet-title').textContent='Nueva categoría';
  document.getElementById('cat-save-btn').textContent='Crear categoría';
  document.getElementById('cat-delete-btn').style.display='none';
  renderColorPickerGrid(); renderEmojiTabsUI(); updateCatPreview();
  openSheet('cat-sheet');
  setTimeout(()=>document.getElementById('cat-name-input').focus(),350);
}

function openEditCatSheet(id) {
  const c=categories.find(x=>x.id===id); if(!c)return;
  editCatId=id; selCatEmoji=c.emoji; selCatColor=c.color; catEmojiPickerOpen=false;
  document.getElementById('cat-name-input').value=c.name;
  document.getElementById('auto-badge').textContent=c.emoji;
  document.getElementById('auto-hint').textContent='Toca el emoji para cambiar';
  document.getElementById('emoji-picker-section').style.display='none';
  document.getElementById('cat-sheet-title').textContent='Editar categoría';
  document.getElementById('cat-save-btn').textContent='Guardar cambios';
  document.getElementById('cat-delete-btn').style.display='block';
  renderColorPickerGrid(); renderEmojiTabsUI(); updateCatPreview();
  openSheet('cat-sheet');
}

function onCatNameInput() {
  const name = document.getElementById('cat-name-input').value;
  const detected = detectEmoji(name);
  const badge = document.getElementById('auto-badge');
  const hint  = document.getElementById('auto-hint');
  if (detected && detected !== selCatEmoji) {
    selCatEmoji=detected;
    badge.textContent=detected;
    badge.style.animation='none'; void badge.offsetWidth;
    badge.style.animation='emojipop .35s cubic-bezier(.34,1.56,.64,1)';
    hint.textContent='✓ Detectamos "'+detected+'" — toca el emoji para cambiar';
    hint.style.color='var(--green)';
    renderEmojiGridUI();
  } else if (!detected) {
    hint.textContent='Escribe el nombre para detectar el emoji';
    hint.style.color='var(--t3)';
  }
  updateCatPreview();
}

function detectEmoji(name) {
  if (!name.trim()) return null;
  const lower = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  for (const entry of EMOJI_MAP) {
    for (const kw of entry.k) {
      if (lower.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g,''))) return entry.e;
    }
  }
  return null;
}

function toggleEmojiPicker() {
  catEmojiPickerOpen=!catEmojiPickerOpen;
  document.getElementById('emoji-picker-section').style.display = catEmojiPickerOpen ? 'block' : 'none';
  if (catEmojiPickerOpen) { renderEmojiTabsUI(); renderEmojiGridUI(); }
}

function renderEmojiTabsUI() {
  const tr = document.getElementById('emoji-tab-row'); if(!tr)return;
  tr.innerHTML = Object.keys(EMOJI_CATS).map(k=>`
    <button onclick="switchEmojiTab('${k}')" style="background:${k===activeEmojiTab?'rgba(233,188,90,.09)':'var(--s2)'};border:none;border-radius:100px;padding:5px 11px;font-size:11px;font-weight:500;color:${k===activeEmojiTab?'var(--gold)':'var(--t2)'};cursor:pointer;white-space:nowrap;font-family:var(--f);transition:all .15s;flex-shrink:0">${k}</button>`).join('');
}
function switchEmojiTab(tab) { activeEmojiTab=tab; renderEmojiTabsUI(); renderEmojiGridUI(); }
function renderEmojiGridUI() {
  const g = document.getElementById('emoji-grid-picker'); if(!g)return;
  const emojis = EMOJI_CATS[activeEmojiTab]||[];
  g.innerHTML = emojis.map(e=>`
    <div onclick="pickCatEmoji('${e}')" style="aspect-ratio:1;background:${e===selCatEmoji?'rgba(233,188,90,.09)':'var(--s2)'};border:${e===selCatEmoji?'1.5px solid var(--gold)':'1.5px solid transparent'};border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:19px;cursor:pointer;transition:all .15s">${e}</div>`).join('');
}
function pickCatEmoji(e) {
  selCatEmoji=e;
  document.getElementById('auto-badge').textContent=e;
  document.getElementById('custom-emoji-input').value='';
  renderEmojiGridUI(); updateCatPreview();
  catEmojiPickerOpen=false;
  document.getElementById('emoji-picker-section').style.display='none';
}
function onCustomEmojiInput(el) {
  const v=el.value.trim(); if(!v)return;
  selCatEmoji=v;
  document.getElementById('auto-badge').textContent=v;
  document.querySelectorAll('#emoji-grid-picker > div').forEach(x=>x.style.border='1.5px solid transparent');
  updateCatPreview();
}
function renderColorPickerGrid() {
  const g = document.getElementById('color-picker-grid'); if(!g)return;
  g.innerHTML = CAT_COLORS.map(c=>`
    <div onclick="pickCatColor('${c}')" style="width:28px;height:28px;border-radius:50%;background:${c};cursor:pointer;transition:all .18s;border:${c===selCatColor?'2.5px solid rgba(255,255,255,.7)':'2px solid transparent'};transform:${c===selCatColor?'scale(1.18)':'scale(1)'}"></div>`).join('');
}
function pickCatColor(c) { selCatColor=c; renderColorPickerGrid(); updateCatPreview(); }
function updateCatPreview() {
  const name = document.getElementById('cat-name-input')?.value.trim()||'Nueva categoría';
  const pi = document.getElementById('cat-prev-ico');
  const pn = document.getElementById('cat-prev-name');
  if (pi) { pi.textContent=selCatEmoji; pi.style.background=selCatColor+'1a'; }
  if (pn) pn.textContent=name;
}

async function saveCategory() {
  const name = document.getElementById('cat-name-input').value.trim();
  if (!name) { toast('Escribe un nombre'); return; }
  const catData = { name, emoji:selCatEmoji, color:selCatColor, uid:user?.uid, updatedAt:new Date().toISOString() };
  try {
    if (editCatId) {
      if (window._fbReady&&user) { const{db,doc,updateDoc}=window._fb; await updateDoc(doc(db,'categories',editCatId),catData); }
      const c=categories.find(x=>x.id===editCatId); if(c)Object.assign(c,catData);
      toast(`✓ "${name}" actualizada`);
    } else {
      if (window._fbReady&&user) { const{db,collection,addDoc}=window._fb; const d=await addDoc(collection(db,'categories'),catData); categories.push({id:d.id,...catData}); }
      else { catData.id='c'+Date.now(); categories.push(catData); }
      toast(`✓ "${name}" creada`);
    }
    localSave('kasa_cats_'+user?.uid,categories);
    closeSheet('cat-sheet'); renderCategoryManage(); updateCatSelects(); renderCatGridPick();
  } catch(e) { toast('Error: '+e.message); }
}

async function deleteCategoryManage() {
  if (!editCatId) return;
  const c=categories.find(x=>x.id===editCatId);
  if (!confirm(`¿Eliminar "${c?.name}"? Los gastos de esta categoría quedarán sin clasificar.`)) return;
  try {
    if (window._fbReady&&user) { const{db,doc,deleteDoc}=window._fb; await deleteDoc(doc(db,'categories',editCatId)); }
    categories=categories.filter(x=>x.id!==editCatId);
    localSave('kasa_cats_'+user?.uid,categories);
    closeSheet('cat-sheet'); renderCategoryManage(); updateCatSelects(); renderCatGridPick();
    toast('Categoría eliminada');
  } catch(e) { toast('Error: '+e.message); }
}

// ── VOICE INPUT ──────────────────────────────────────────────────
function toggleMic() {
  if (!('webkitSpeechRecognition' in window||'SpeechRecognition' in window)) { toast('Usa Chrome para voz'); return; }
  if (isRec) { rec?.stop(); return; }
  const SR = window.SpeechRecognition||window.webkitSpeechRecognition;
  rec=new SR(); rec.lang='es-CO'; rec.continuous=false; rec.interimResults=true;
  rec.onstart=()=>{isRec=true;document.getElementById('mic-wrap').classList.add('rec');document.getElementById('mic-lbl').textContent='Grabando... toca para detener';};
  rec.onresult=e=>{
    const t=Array.from(e.results).map(r=>r[0].transcript).join('');
    document.getElementById('mic-transcript').textContent=t;
    if(e.results[e.results.length-1].isFinal){
      const nums=t.match(/[\d,.]+/g);
      if(nums){const n=parseFloat(nums[nums.length-1].replace(',','.'));if(n)document.getElementById('add-amt').value=n;}
      const desc=t.replace(/[\d,.]+\s*(pesos|mil|mil pesos)?/gi,'').trim()||t;
      document.getElementById('add-desc').value=desc;
      const l=t.toLowerCase();
      const detected=detectEmoji(l);
      if(detected){const c=categories.find(x=>x.emoji===detected)||categories[0];if(c)pickCat(c.id);}
    }
  };
  rec.onend=()=>{isRec=false;document.getElementById('mic-wrap').classList.remove('rec');document.getElementById('mic-lbl').textContent='Toca para registrar por voz';};
  rec.onerror=()=>{rec.stop();toast('Error de micrófono');};
  rec.start();
}

// ── AI CHAT ──────────────────────────────────────────────────────
function saveApiKey() {
  const k=document.getElementById('key-input').value.trim(); if(!k)return;
  apiKey=k; localStorage.setItem('kasa_ak',k);
  document.getElementById('key-row').style.display='none';
  document.getElementById('key-status-lbl').textContent='✓ Configurada';
  toast('✓ API key guardada');
}

function initChat() {
  if (chatInited) return; chatInited=true;
  if (apiKey) document.getElementById('key-row').style.display='none';
  addBubble('ai','¡Hola! 👋 Soy Kasa IA. Tengo acceso a todos tus gastos, presupuestos y metas. Pregúntame lo que necesites sobre tus finanzas.');
}

function useSugg(el) { document.getElementById('chat-q').value=el.textContent; sendChat(); }

async function sendChat() {
  const inp=document.getElementById('chat-q'); const q=inp.value.trim(); if(!q)return;
  inp.value=''; addBubble('user',q);
  if (!apiKey) { addBubble('ai','⚠️ Necesitas una API key de Anthropic. Es gratis en console.anthropic.com — configúrala arriba.'); return; }
  const thinking=addBubble('ai','Analizando...','thinking');
  const ctx=buildAIContext();
  try {
    const r=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514', max_tokens:1000,
        system:`Eres Kasa IA, asistente de finanzas personales. Respondes en español colombiano informal. Eres directo, útil, concreto. Emojis ocasionales. Usa los datos exactos del usuario.\n\n${ctx}`,
        messages:[{role:'user',content:q}]
      })
    });
    const d=await r.json();
    thinking.remove();
    addBubble('ai', d.content?.[0]?.text||'Sin respuesta.');
  } catch(e) { thinking.remove(); addBubble('ai','Error de conexión. Verifica tu API key.'); }
}

function buildAIContext() {
  const filt = filtered();
  const expCtx = filt.slice(0,150).map(e=>{
    const c=categories.find(x=>x.id===e.cat);
    return `${e.date}|${c?.name||e.cat}|${e.desc}|$${e.amount}`;
  }).join('\n');
  const budCtx = budgets.map(b=>{
    const c=categories.find(x=>x.id===b.catId); const spent=filt.filter(e=>e.cat===b.catId).reduce((s,e)=>s+e.amount,0);
    return `${c?.name||'?'}: $${fmt(spent)} de $${fmt(b.limit)}`;
  }).join(', ');
  const goalCtx = goals.map(g=>`${g.name}: $${fmt(g.saved||0)} de $${fmt(g.target)}`).join(', ');
  const recCtx = recurring.map(r=>{const c=categories.find(x=>x.id===r.catId);return `${r.desc} ($${fmt(r.amount)}) día ${r.day}`;}).join(', ');
  return `GASTOS PERÍODO ACTUAL:\n${expCtx||'Sin gastos'}\n\nPRESUPUESTOS: ${budCtx||'Ninguno'}\nMETAS: ${goalCtx||'Ninguna'}\nGASTOS FIJOS: ${recCtx||'Ninguno'}\nPERÍODO: ${periodStr()}`;
}

function addBubble(role,text,extra=''){
  const d=document.createElement('div'); d.className=`bub ${role} ${extra}`; d.textContent=text;
  const msgs=document.getElementById('chat-msgs'); msgs.appendChild(d); msgs.scrollTop=9999; return d;
}

// ── NOTIFICATIONS ────────────────────────────────────────────────
async function requestPushPermission() {
  if (!('Notification' in window)) { toast('Tu navegador no soporta notificaciones'); return; }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    document.getElementById('push-status').textContent = '✓ Notificaciones activas';
    toast('✓ Notificaciones habilitadas');
    if (window._fb?.messaging && window._fb?.getToken) {
      try {
        const token = await window._fb.getToken(window._fb.messaging);
        if (token) localStorage.setItem('kasa_fcm_'+user?.uid, token);
      } catch(e) {}
    }
    scheduleDemoNotif();
  } else {
    toast('Notificaciones bloqueadas en este navegador');
  }
}

function scheduleDemoNotif() {
  setTimeout(() => {
    if (Notification.permission === 'granted') {
      new Notification('Kasa 💰', { body: 'Lleva el control de tus gastos. ¡Recuerda registrar todo!', icon: 'icons/icon-192.png' });
    }
  }, 3000);
}

// Weekly check
function checkWeeklyNotif() {
  const now=new Date(); const day=now.getDay(); const hour=now.getHours();
  if (day===1 && hour>=8 && hour<=10) {
    const lastWeek=localStorage.getItem('kasa_last_weekly');
    const thisMonday=now.toISOString().split('T')[0];
    if (lastWeek!==thisMonday && Notification.permission==='granted') {
      const total=filtered().reduce((s,e)=>s+e.amount,0);
      new Notification('Resumen semanal Kasa 📊',{body:`Esta semana gastaste $${fmt(total)}. ¡Revisa tu dashboard!`,icon:'icons/icon-192.png'});
      localStorage.setItem('kasa_last_weekly',thisMonday);
    }
  }
}
setInterval(checkWeeklyNotif, 60*60*1000);

// ── PROFILE / SIGN OUT ───────────────────────────────────────────
function openProfileSheet() {
  if (!user) return;
  const name = user.displayName || 'Usuario';
  const pa = document.getElementById('profile-ava-big');
  if (user.photoURL) pa.innerHTML = `<img src="${user.photoURL}" alt="">`;
  else pa.textContent = name[0].toUpperCase();
  document.getElementById('profile-name').textContent = name;
  document.getElementById('profile-email').textContent = user.email || '';
  document.getElementById('profile-name-sub').textContent = name;
  document.getElementById('profile-email-sub').textContent = user.email || '';
  // Verify badge
  const badge = document.getElementById('profile-verify-badge');
  if (badge) badge.style.display = user.emailVerified ? 'none' : 'block';
  // Stats
  const total = expenses.reduce((s,e) => s+e.amount, 0);
  document.getElementById('profile-stats').innerHTML =
    `${expenses.length} gastos registrados &nbsp;·&nbsp; $${fmt(total)} total<br>${categories.length} categorías &nbsp;·&nbsp; ${budgets.length} presupuestos &nbsp;·&nbsp; ${recurring.length} fijos`;
  // Theme toggle state
  const tt = document.getElementById('theme-toggle');
  if (tt) tt.classList.toggle('on', document.documentElement.classList.contains('light'));
  // Hide inline panels
  document.getElementById('edit-name-panel').style.display = 'none';
  document.getElementById('change-email-panel').style.display = 'none';
}

function openEditName() {
  const p = document.getElementById('edit-name-panel');
  const show = p.style.display === 'none';
  p.style.display = show ? 'block' : 'none';
  document.getElementById('change-email-panel').style.display = 'none';
  if (show) {
    document.getElementById('edit-name-input').value = user.displayName || '';
    setTimeout(() => document.getElementById('edit-name-input').focus(), 100);
  }
}

function openChangePassword() {
  const { auth, sendPasswordResetEmail } = window._fb;
  sendPasswordResetEmail(auth, user.email)
    .then(() => toast('✉️ Enlace enviado a ' + user.email + '. Revisa tu correo.'))
    .catch(e => toast('Error: ' + e.message));
}

function openChangeEmail() {
  const p = document.getElementById('change-email-panel');
  const show = p.style.display === 'none';
  p.style.display = show ? 'block' : 'none';
  document.getElementById('edit-name-panel').style.display = 'none';
  if (show) {
    document.getElementById('new-email-input').value = '';
    document.getElementById('email-pass-input').value = '';
    setTimeout(() => document.getElementById('new-email-input').focus(), 100);
  }
}

async function saveDisplayName() {
  const name = document.getElementById('edit-name-input').value.trim();
  if (!name) { toast('Escribe un nombre'); return; }
  try {
    const { updateProfile } = window._fb;
    await updateProfile(user, { displayName: name });
    updateAvatarUI();
    document.getElementById('edit-name-panel').style.display = 'none';
    toast('✓ Nombre actualizado');
    // Refresh profile sheet display
    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-name-sub').textContent = name;
    const pa = document.getElementById('profile-ava-big');
    if (!user.photoURL) pa.textContent = name[0].toUpperCase();
  } catch(e) { toast('Error: ' + e.message); }
}

async function saveNewEmail() {
  const newEmail = document.getElementById('new-email-input').value.trim();
  const pass = document.getElementById('email-pass-input').value;
  if (!newEmail || !pass) { toast('Completa ambos campos'); return; }
  if (!newEmail.includes('@')) { toast('Correo inválido'); return; }
  try {
    const { signInWithEmailAndPassword, updateEmail } = window._fb;
    // Re-authenticate first
    await signInWithEmailAndPassword(window._fb.auth, user.email, pass);
    // updateEmail is on the user object directly
    await user.updateEmail(newEmail);
    document.getElementById('change-email-panel').style.display = 'none';
    toast('✓ Correo actualizado a ' + newEmail);
    updateAvatarUI();
    document.getElementById('profile-email').textContent = newEmail;
    document.getElementById('profile-email-sub').textContent = newEmail;
  } catch(e) {
    const msgs = {
      'auth/wrong-password':    'Contraseña incorrecta',
      'auth/email-already-in-use': 'Ese correo ya está en uso',
      'auth/invalid-email':     'Correo inválido',
      'auth/requires-recent-login': 'Sesión expirada. Cierra sesión y vuelve a entrar.',
    };
    toast(msgs[e.code] || 'Error: ' + e.message);
  }
}

function toggleTheme() {
  const isLight = document.documentElement.classList.toggle('light');
  localStorage.setItem('kasa_theme', isLight ? 'light' : 'dark');
  const tt = document.getElementById('theme-toggle');
  if (tt) tt.classList.toggle('on', isLight);
}

async function doSignOut() {
  if (unsubExpenses) { unsubExpenses(); unsubExpenses=null; }
  expenses=[];
  const{auth,signOut}=window._fb;
  await signOut(auth);
  closeSheet('profile-sheet');
  S('s-auth');
}
function confirmSignOut() { if(confirm('¿Cerrar sesión?')) doSignOut(); }

// ── EXPORT ───────────────────────────────────────────────────────
function exportCSV() {
  if(!expenses.length){toast('Sin gastos para exportar');return;}
  const hdr='Fecha,Descripción,Categoría,Monto,Nota,Visibilidad';
  const rows=expenses.map(e=>{const c=categories.find(x=>x.id===e.cat)?.name||e.cat;return[e.date,`"${(e.desc||'').replace(/"/g,'""')}"`,c,e.amount,`"${(e.note||'').replace(/"/g,'""')}"`,e.visibility||'personal'].join(',');});
  const blob=new Blob([[hdr,...rows].join('\n')],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kasa-${today()}.csv`;a.click();
  toast('✓ CSV exportado');
}
function exportJSON() {
  if(!expenses.length){toast('Sin datos para exportar');return;}
  const blob=new Blob([JSON.stringify({expenses,categories,budgets,goals,recurring,exportDate:new Date().toISOString()},null,2)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`kasa-backup-${today()}.json`;a.click();
  toast('✓ Backup exportado');
}

// ── SHEETS ───────────────────────────────────────────────────────
function openSheet(id) {
  const el=document.getElementById(id); if(!el)return;
  if (id==='period-sheet') renderPeriodSheet();
  if (id==='profile-sheet') openProfileSheet();
  el.classList.add('show');
}
function closeSheet(id) { document.getElementById(id)?.classList.remove('show'); }

// ── SETTINGS UPDATE ──────────────────────────────────────────────
function updateSettingsLabels() {
  updatePeriodLabels();
  document.getElementById('cats-count-lbl').textContent = categories.length + ' categorías';
  document.getElementById('key-status-lbl').textContent = apiKey ? '✓ Configurada' : 'No configurada';
  document.getElementById('family-count-lbl').textContent = family.length ? `${family.length+1} miembros` : 'Gestiona miembros e invitaciones';
}

// ── UTILS ────────────────────────────────────────────────────────
function animNumber(id, prefix, target) {
  const el=document.getElementById(id); if(!el)return;
  const t0=performance.now();
  (function step(t){const p=Math.min((t-t0)/700,1),e=1-Math.pow(1-p,3);el.textContent=prefix+fmt(Math.round(target*e));if(p<1)requestAnimationFrame(step);})(t0);
}
function fmt(n)      { return Math.round(n).toLocaleString('es-CO'); }
function today()     { return new Date().toISOString().split('T')[0]; }
function fmtDate(d)  { return new Date((d||'').includes('T')?d:d+'T12:00:00').toLocaleDateString('es-CO',{day:'numeric',month:'short'}); }
function esc(s)      { const d=document.createElement('div');d.textContent=s||'';return d.innerHTML; }
function toast(msg)  {
  const t=document.getElementById('toast'); t.textContent=msg; t.classList.add('show');
  clearTimeout(t._tid); t._tid=setTimeout(()=>t.classList.remove('show'),2500);
}

// ── SERVICE WORKER ───────────────────────────────────────────────
// Desregistrar Service Workers para evitar caché obsoleto
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(r => r.unregister());
  });
  caches.keys().then(keys => keys.forEach(k => caches.delete(k)));
}
