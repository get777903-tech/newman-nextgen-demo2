/* Newman Center Next-Gen v2 — enhance.js (vanilla, no deps) */
(function () {
  'use strict';
  var WA = '972532733777', TEL = '1800220607';
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  function L() { var l = document.documentElement.lang; return (l === 'he' || l === 'en') ? l : 'ru'; }
  function T(o) { return o[L()]; }
  function wa(txt) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var reg = [];
  function register(fn) { reg.push(fn); fn(); }
  function refreshAll() { reg.forEach(function (fn) { try { fn(); } catch (e) {} }); }

  /* ---------- 1. Ambient mesh glow ---------- */
  function initGlow() {
    var g = document.createElement('div'); g.id = 'nm-glow'; g.setAttribute('aria-hidden', 'true');
    document.body.insertBefore(g, document.body.firstChild);
    var raf = 0, px = 0, py = 0;
    window.addEventListener('mousemove', function (e) {
      px = e.clientX; py = e.clientY;
      if (raf) return;
      raf = requestAnimationFrame(function () {
        raf = 0;
        g.style.setProperty('--mx', px + 'px'); g.style.setProperty('--my', py + 'px');
        g.style.setProperty('--mx2', (window.innerWidth - px * 0.8) + 'px'); g.style.setProperty('--my2', (window.innerHeight - py * 0.8) + 'px');
      });
    }, { passive: true });
  }

  /* ---------- 2. Floating social proof chips (index hero) ---------- */
  function initChips() {
    var s = document.getElementById('heroCourseSearch');
    var sec = s && s.closest('section');
    if (!sec) return;
    sec.style.position = 'relative';
    var a = document.createElement('div'); a.className = 'nm-chip'; a.style.cssText = 'top:14px;right:16px;';
    var b = document.createElement('div'); b.className = 'nm-chip nm-chip-b'; b.style.cssText = 'bottom:18px;left:16px;';
    sec.appendChild(a); sec.appendChild(b);
    register(function () {
      a.innerHTML = '<span style="font-size:22px">🎓</span><span><b>34</b> ' + T({ ru: 'выпускника трудоустроено в октябре 2026', he: 'בוגרים הושמו בעבודה באוקטובר 2026', en: 'graduates hired in October 2026' }) + '</span>';
      b.innerHTML = '<span style="font-size:22px">🏛️</span><span>' + T({ ru: 'Официальный партнер Министерства алии Израиля', he: 'שותף רשמי של משרד העלייה והקליטה', en: 'Official partner of Israel’s Ministry of Aliyah' }) + '</span>';
    });
    /* metallic shine on key hero phrase */
    var hl = document.querySelector('[data-i18n="hero_h1_highlight"]');
    if (hl) hl.classList.add('nm-metal');
  }

  /* ---------- 3. WhatsApp FAB ---------- */
  function initFab() {
    var f = document.createElement('div'); f.id = 'nm-fab';
    f.innerHTML = '<a class="nm-fab-btn" target="_blank" rel="noopener" aria-label="WhatsApp"><svg viewBox="0 0 32 32" fill="currentColor"><path d="M16 3C9 3 3.3 8.6 3.3 15.5c0 2.4.7 4.7 2 6.6L3 29l7.100-2.200c1.800 1 3.800 1.500 5.900 1.500 7 0 12.700-5.600 12.700-12.500S23 3 16 3zm0 22.700c-1.900 0-3.700-.5-5.300-1.500l-.4-.2-4.200 1.300 1.400-4-.3-.4a10 10 0 0 1-1.600-5.400C5.600 10 10.300 5.600 16 5.600s10.400 4.400 10.400 9.900-4.700 10.200-10.400 10.200zm5.700-7.600c-.3-.2-1.800-.9-2.100-1s-.5-.2-.7.200-.8 1-1 1.200-.4.200-.7.100a8.400 8.400 0 0 1-4.200-3.700c-.3-.6.300-.5.900-1.700.1-.2 0-.4 0-.5l-1-2.300c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.400-.3.400-1.200 1.200-1.200 2.800s1.200 3.300 1.400 3.500c.2.200 2.400 3.700 5.900 5.100 2.200.9 3 .9 4 .8.600-.1 1.800-.7 2-1.400.3-.7.300-1.300.2-1.400-.1-.2-.3-.3-.6-.4z"/></svg><span class="nm-online"></span></a><div class="nm-bubble"><button type="button" aria-label="close">×</button><span class="nm-btxt"></span></div>';
    document.body.appendChild(f);
    var bubble = f.querySelector('.nm-bubble');
    if (sessionStorage.getItem('nm_fab_closed')) bubble.style.display = 'none';
    bubble.querySelector('button').addEventListener('click', function () { bubble.style.display = 'none'; sessionStorage.setItem('nm_fab_closed', '1'); });
    register(function () {
      f.querySelector('.nm-btxt').textContent = T({ ru: 'Координатор онлайн. Узнайте право на ваучер 7000₪ за 1 минуту', he: 'המתאם מקוון. בדקו זכאות לשובר 7000₪ תוך דקה', en: 'Coordinator online. Check your 7000₪ voucher eligibility in 1 minute' });
      f.querySelector('a').href = wa(T({ ru: 'Здравствуйте, Newman Center! Хочу узнать за 1 минуту, имею ли я право на ваучер до 80% (7000₪).', he: 'שלום Newman Center! אשמח לבדוק תוך דקה זכאות לשובר עד 80% (7000₪).', en: 'Hello Newman Center! I would like to check in 1 minute if I qualify for the up-to-80% (7000₪) voucher.' }));
    });
  }

  /* ---------- 4. Mobile drawer + sticky thumb bar ---------- */
  function initDrawer() {
    var hdr = document.querySelector('header > div');
    if (!hdr) return;
    var burger = document.createElement('button'); burger.type = 'button'; burger.className = 'nm-burger'; burger.setAttribute('aria-label', 'Menu'); burger.textContent = '☰';
    hdr.appendChild(burger);
    var d = document.createElement('div'); d.id = 'nm-drawer'; d.setAttribute('role', 'dialog'); document.body.appendChild(d);
    function build() {
      var links = [
        ['index.html', '🏛️', T({ ru: 'Главная', he: 'ראשי', en: 'Home' })],
        ['courses.html', '📚', T({ ru: 'Все 40 курсов', he: 'כל 40 הקורסים', en: 'All 40 Courses' })],
        ['offer.html', '🎫', T({ ru: 'Калькулятор Ваучера 80%', he: 'מחשבון שובר 80%', en: '80% Voucher Calculator' })],
        ['audit.html', '📊', T({ ru: 'Аудит & Стратегия Роста', he: 'אודיט ואסטרטגיית צמיחה', en: 'Audit & Growth Strategy' })]
      ];
      d.innerHTML = '<div class="nm-d-top"><strong style="font-size:20px;font-family:\'Plus Jakarta Sans\',sans-serif">Newman Center</strong><button type="button" class="nm-d-close" aria-label="Close">✕</button></div>' +
        links.map(function (x) { return '<a class="nm-d-link" href="' + x[0] + '"><span>' + x[1] + '</span><span>' + esc(x[2]) + '</span></a>'; }).join('') +
        '<div class="nm-d-row"><button type="button" data-lang="ru" class="' + (L() === 'ru' ? 'act' : '') + '">RU</button><button type="button" data-lang="he" class="' + (L() === 'he' ? 'act' : '') + '">עב</button><button type="button" data-lang="en" class="' + (L() === 'en' ? 'act' : '') + '">EN</button><button type="button" data-theme="1">🌓</button></div>' +
        '<div class="nm-d-row"><a class="act" href="tel:' + TEL + '">📞 1-800-22-06-07</a><a class="act" target="_blank" rel="noopener" href="' + wa(T({ ru: 'Здравствуйте, Newman Center! Хочу проверить право на ваучер до 80%.', he: 'שלום Newman Center! אשמח לבדוק זכאות לשובר עד 80%.', en: 'Hello Newman Center! I want to check my up-to-80% voucher eligibility.' })) + '">💬 WhatsApp</a></div>';
    }
    register(build);
    d.addEventListener('click', function (e) {
      var t = e.target.closest('button,a'); if (!t) return;
      if (t.classList.contains('nm-d-close') || t.classList.contains('nm-d-link')) { d.classList.remove('open'); document.body.style.overflow = ''; }
      if (t.dataset && t.dataset.lang && window.setLanguage) { window.setLanguage(t.dataset.lang); }
      if (t.dataset && t.dataset.theme && window.toggleTheme) { window.toggleTheme(); }
    });
    burger.addEventListener('click', function () { d.classList.add('open'); document.body.style.overflow = 'hidden'; });
    /* ensure a sticky thumb bar exists */
    if (!document.querySelector('.fixed.bottom-0')) {
      var bar = document.createElement('div');
      bar.className = 'fixed bottom-0 left-0 right-0 z-40 lg:hidden flex items-center gap-2 px-3 py-2 border-t border-violet-400/40';
      bar.style.cssText = 'background:rgba(9,13,22,.94);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)';
      bar.innerHTML = '<a href="tel:' + TEL + '" style="flex:1;min-height:48px;display:grid;place-items:center;border-radius:14px;font-weight:900;color:#fff;background:#1e293b;border:1px solid rgba(139,92,246,.5);text-decoration:none">📞 1-800-22-06-07</a><a target="_blank" rel="noopener" data-nm-wa="1" style="flex:1;min-height:48px;display:grid;place-items:center;border-radius:14px;font-weight:900;color:#fff;background:linear-gradient(90deg,#7c3aed,#0ea5e9);text-decoration:none">💬 WhatsApp</a>';
      document.body.appendChild(bar);
      register(function () { bar.querySelector('[data-nm-wa]').href = wa(T({ ru: 'Здравствуйте, Newman Center! Хочу проверить право на ваучер до 80%.', he: 'שלום Newman Center! אשמח לבדוק זכאות לשובר עד 80%.', en: 'Hello Newman Center! I want to check my up-to-80% voucher eligibility.' })); });
      document.body.style.paddingBottom = '84px';
    }
  }

  /* ---------- 5. Salary tracker (global, used by index template) ---------- */
  var SAL = {
    junior: { v: '12000₪', usd: '≈3200$' },
    middle: { v: '18000₪', usd: '≈4900$' },
    senior: { v: '26000–32000₪', usd: '≈7000–8600$' }
  };
  window.nmSalaryHTML = function () {
    var mo = T({ ru: 'в месяц', he: 'לחודש', en: 'per month' });
    var h = '<div class="nm-sal"><div class="nm-sal-tabs">';
    [['junior', 'Junior'], ['middle', 'Middle'], ['senior', 'Senior / Lead']].forEach(function (x, i) {
      h += '<button type="button" class="' + (i === 0 ? 'on' : '') + '" onclick="nmSalary(this,\'' + x[0] + '\')">' + x[1] + '<br><span class="nm-num">' + SAL[x[0]].v + '</span></button>';
    });
    h += '</div><div class="nm-sal-val nm-num">' + SAL.junior.v + '<small>' + SAL.junior.usd + ' ' + mo + '</small></div></div>';
    return h;
  };
  window.nmSalary = function (btn, lvl) {
    var root = btn.closest('.nm-sal'); if (!root) return;
    root.querySelectorAll('.nm-sal-tabs button').forEach(function (b) { b.classList.remove('on'); });
    btn.classList.add('on');
    var mo = T({ ru: 'в месяц', he: 'לחודש', en: 'per month' });
    root.querySelector('.nm-sal-val').innerHTML = SAL[lvl].v + '<small>' + SAL[lvl].usd + ' ' + mo + '</small>';
  };

  /* ---------- 6. Quick search + category chips (index catalog) ---------- */
  function initQuick() {
    var tabs = document.getElementById('bentoCategoryTabs');
    if (!tabs) return;
    var bar = document.createElement('div'); bar.className = 'nm-quick'; bar.id = 'nmQuick';
    tabs.parentNode.insertBefore(bar, tabs);
    function build() {
      var cur = bar.querySelector('input') ? bar.querySelector('input').value : '';
      bar.innerHTML = '<input type="search" id="nmQuickInput" value="' + esc(cur) + '" placeholder="' + T({ ru: '🔎 Мгновенный поиск: AI, QA, Python, бухгалтерия…', he: '🔎 חיפוש מיידי: AI, QA, Python, הנהלת חשבונות…', en: '🔎 Instant search: AI, QA, Python, accounting…' }) + '" />' +
        [['all', T({ ru: 'Все направления', he: 'כל המסלולים', en: 'All tracks' })],
         ['ai', T({ ru: 'ИИ и Маркетинг (AEO/SEO)', he: 'AI ושיווק (AEO/SEO)', en: 'AI & Marketing (AEO/SEO)' })],
         ['dev', T({ ru: 'Разработка ПО и Мобильные приложения', he: 'פיתוח תוכנה ואפליקציות', en: 'Software & Mobile Development' })],
         ['qa', T({ ru: 'Тестирование QA', he: 'בדיקות QA', en: 'QA Testing' })],
         ['cyber', T({ ru: 'Кибербезопасность', he: 'סייבר', en: 'Cybersecurity' })]]
          .map(function (c) { return '<button type="button" data-act="' + c[0] + '">' + esc(c[1]) + '</button>'; }).join('');
    }
    register(build);
    bar.addEventListener('input', function (e) {
      if (e.target.id === 'nmQuickInput' && window.filterCoursesFromHero) { var h = document.getElementById('heroCourseSearch'); if (h) h.value = e.target.value; window.filterCoursesFromHero(e.target.value); }
    });
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]'); if (!b) return;
      var act = b.dataset.act, inp = document.getElementById('nmQuickInput');
      bar.querySelectorAll('button').forEach(function (x) { x.classList.remove('on'); }); b.classList.add('on');
      if (inp) inp.value = '';
      var h = document.getElementById('heroCourseSearch'); if (h) h.value = '';
      if (act === 'all') { window.filterCoursesFromHero(''); window.selectCategoryFilter && window.selectCategoryFilter('all'); }
      else if (act === 'ai') { window.selectCategoryFilter && window.selectCategoryFilter('ai_marketing_geo'); }
      else if (act === 'dev') { window.filterCoursesFromHero('Full-Stack'); }
      else if (act === 'qa') { window.filterCoursesFromHero('QA'); }
      else if (act === 'cyber') { window.open(wa(T({ ru: 'Здравствуйте! Интересует направление «Кибербезопасность» в Newman Center. Подскажите, пожалуйста, по программам и ваучеру.', he: 'שלום! מעוניין/ת במסלול סייבר ב-Newman Center. אשמח לפרטים על התוכנית והשובר.', en: 'Hello! I am interested in the Cybersecurity track at Newman Center. Please advise on programs and voucher.' })), '_blank'); }
    });
  }

  /* ---------- 7. Circular gauge + PDF (offer.html) ---------- */
  function initGauge() {
    var pctEl = document.getElementById('res-coverage-pct');
    if (!pctEl) return;
    var row = pctEl.parentNode;
    var w = document.createElement('div'); w.className = 'nm-gauge-wrap';
    var C = 2 * Math.PI * 64;
    w.innerHTML = '<div class="nm-gauge"><svg viewBox="0 0 150 150"><defs><linearGradient id="nmGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#38bdf8"/></linearGradient></defs><circle class="trk" cx="75" cy="75" r="64" fill="none" stroke-width="13"/><circle class="bar" cx="75" cy="75" r="64" fill="none" stroke-width="13" stroke-dasharray="' + C + '" stroke-dashoffset="' + C + '"/></svg><div class="lbl"><div><span class="nm-num" id="nmGaugeNum">0%</span><small id="nmGaugeCap"></small></div></div></div><div class="nm-gauge-txt text-xs font-bold text-sky-100" style="max-width:190px;line-height:1.5"></div>';
    row.parentNode.insertBefore(w, row);
    var bar = w.querySelector('.bar'), num = w.querySelector('#nmGaugeNum');
    function upd() {
      var m = (pctEl.textContent || '').match(/(\d+)/); var p = m ? Math.min(100, parseInt(m[1], 10)) : 0;
      bar.style.strokeDashoffset = C * (1 - p / 100);
      num.textContent = p + '%';
      w.querySelector('#nmGaugeCap').textContent = T({ ru: 'покрывает государство', he: 'מימון ממשלתי', en: 'state-covered' });
      var s = document.getElementById('res-coverage-sum');
      w.querySelector('.nm-gauge-txt').textContent = s ? s.textContent : '';
    }
    new MutationObserver(upd).observe(pctEl, { childList: true, characterData: true, subtree: true });
    var s2 = document.getElementById('res-coverage-sum'); if (s2) new MutationObserver(upd).observe(s2, { childList: true, characterData: true, subtree: true });
    register(upd);
    setTimeout(upd, 150);
  }

  var PDF = {
    title: { ru: 'Персональный расчёт ваучера и программа обучения', he: 'חישוב אישי של שובר ותוכנית לימודים', en: 'Personal Voucher Calculation & Study Programme' },
    btn: { ru: '📄 Скачать персональный расчет ваучера и программу обучения в PDF', he: '📄 הורדת חישוב שובר אישי ותוכנית לימודים ב-PDF', en: '📄 Download personal voucher calculation & programme (PDF)' },
    f: { ru: ['Имя', 'Статус', 'Программа', 'Интенсивность', 'Покрытие обучения', 'Ожидаемый доход', 'Примечание'], he: ['שם', 'סטטוס', 'מסלול', 'עצימות', 'כיסוי שכר לימוד', 'הכנסה צפויה', 'הערה'], en: ['Name', 'Status', 'Programme', 'Intensity', 'Tuition coverage', 'Expected income', 'Note'] },
    docs: { ru: 'Документы для куратора: удостоверение личности, теудат оле, сертификат ульпана Алеф, письменное обязательство трудоустройства (бланк выдаёт центр).', he: 'מסמכים למתאם: תעודת זהות, תעודת עולה, תעודת אולפן א׳, התחייבות להשמה בעבודה (הטופס מונפק על ידי המרכז).', en: 'Documents for the case officer: ID, Teudat Oleh, Ulpan Alef certificate, written job-placement commitment (form issued by the centre).' },
    disc: { ru: 'Предварительный расчёт; окончательное решение принимает Министерство алии и интеграции.', he: 'חישוב ראשוני; ההחלטה הסופית בידי משרד העלייה והקליטה.', en: 'Preliminary estimate; the final decision rests with the Ministry of Aliyah and Integration.' }
  };
  function g(id) { var e = document.getElementById(id); return e ? e.textContent.trim().replace(/\s+/g, ' ') : ''; }
  function buildPdf() {
    var sel = document.getElementById('track-select');
    var st = document.querySelector('#status-buttons .status-btn.border-2 [data-i18n$="_title"]') || document.querySelector('#status-buttons .status-btn.border-2');
    var vals = [g('calc-user-name') || '—', st ? st.textContent.trim().replace(/\s+/g, ' ') : '—', sel ? sel.options[sel.selectedIndex].text : '—', g('hours-display'), g('res-coverage-pct') + ' ' + g('res-coverage-sum'), g('res-salary-nis') + ' (' + g('res-salary-usd') + ')', g('res-legal-note')];
    var lang = L(), dir = lang === 'he' ? 'rtl' : 'ltr';
    var rows = PDF.f[lang].map(function (k, i) { return '<tr><th>' + esc(k) + '</th><td>' + esc(vals[i]) + '</td></tr>'; }).join('');
    var date = new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : (lang === 'he' ? 'he-IL' : 'en-GB'));
    var html = '<!DOCTYPE html><html lang="' + lang + '" dir="' + dir + '"><head><meta charset="utf-8"><title>Newman Center — ' + esc(PDF.title[lang]) + '</title><style>' +
      'body{font-family:"Segoe UI",Arial,"Heebo",sans-serif;color:#0f172a;margin:0;padding:36px;line-height:1.55}.hd{display:flex;justify-content:space-between;align-items:center;border-bottom:4px solid #7c3aed;padding-bottom:14px}.br{font-size:28px;font-weight:900;color:#5b21b6}.br small{display:block;font-size:12px;color:#0369a1;font-weight:700}h1{font-size:22px;margin:22px 0 10px}table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:10px 12px;text-align:' + (dir === 'rtl' ? 'right' : 'left') + ';font-size:14px;vertical-align:top}th{background:#ede9fe;width:32%;color:#4c1d95}.box{margin-top:18px;padding:14px;border-radius:12px;background:#f0f9ff;border:1px solid #7dd3fc;font-size:13.5px}.seal{width:120px;height:120px}.ft{margin-top:22px;font-size:12px;color:#334155}@media print{body{padding:18px}}</style></head><body>' +
      '<div class="hd"><div class="br">Newman Center<small>מרכז ניומן • Est. 1991</small></div><svg class="seal" viewBox="0 0 120 120"><circle cx="60" cy="60" r="55" fill="none" stroke="#7c3aed" stroke-width="4"/><circle cx="60" cy="60" r="45" fill="none" stroke="#0284c7" stroke-width="2"/><text x="60" y="52" text-anchor="middle" font-size="13" font-weight="900" fill="#5b21b6">NEWMAN</text><text x="60" y="68" text-anchor="middle" font-size="13" font-weight="900" fill="#5b21b6">CENTER</text><text x="60" y="86" text-anchor="middle" font-size="10" font-weight="700" fill="#0369a1">Est. 1991</text></svg></div>' +
      '<h1>' + esc(PDF.title[lang]) + '</h1><div style="font-size:13px;color:#475569">' + esc(date) + ' • Derech HaHagana 34, Tel Aviv • 1-800-22-06-07 • +972-3-560-30-46</div><div style="height:12px"></div><table>' + rows + '</table><div class="box">' + esc(PDF.docs[lang]) + '</div><div class="ft">' + esc(PDF.disc[lang]) + '</div></body></html>';
    var win = window.open('', '_blank');
    if (!win) { alert(T({ ru: 'Разрешите всплывающие окна, чтобы скачать PDF.', he: 'אפשרו חלונות קופצים כדי להוריד PDF.', en: 'Please allow pop-ups to download the PDF.' })); return; }
    win.document.open(); win.document.write(html); win.document.close(); win.focus();
    setTimeout(function () { win.print(); }, 450);
  }
  function initPdf() {
    var wab = document.querySelector('button[onclick*="sendCalculatorToWhatsApp"]');
    if (!wab) return;
    var b = document.createElement('button'); b.type = 'button';
    b.className = 'w-full rounded-2xl font-extrabold text-sm border-2 border-sky-300 bg-slate-900 text-white hover:bg-violet-700 transition-colors';
    b.style.cssText = 'min-height:52px;padding:12px 16px';
    wab.parentNode.insertBefore(b, wab.nextSibling);
    b.addEventListener('click', buildPdf);
    register(function () { b.textContent = T(PDF.btn); });
  }

  /* ---------- 8. Boot ---------- */
  function boot() {
    initGlow();
    if (page === 'index.html' || page === '') initChips();
    initFab(); initDrawer();
    if (page === 'index.html' || page === '') initQuick();
    if (page === 'offer.html') { initGauge(); initPdf(); }
    new MutationObserver(refreshAll).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    if (typeof window.renderBentoCourses === 'function') window.renderBentoCourses();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
