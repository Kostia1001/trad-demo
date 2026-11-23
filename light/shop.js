/* Навігація й полки вітрини (17 листопада 2026, після незалежної оцінки макета):
   меню профілю й рядок розділів у шапці, рядок розділів на головній, шлях, швидкі фільтри,
   мініатюри й лічильник у галереї, «Схожі оголошення». Підключає build_shop.py; розмітку сторінок не переписує,
   а доповнює під час відкриття, тому всі попередні кнопки й стани працюють як раніше. */
(function () {
  var q = new URLSearchParams(location.search), page = location.pathname.split('/').pop() || 'home.html';
  var wide = window.matchMedia('(min-width: 900px)');
  var CATS = [
    ['Жіночий одяг', 'women', 'cat-women.jpg', ['Куртки й пальта', 'Джинси', 'Худі та світшоти', 'Футболки', 'Сукні'], 'Жіноче'],
    ['Чоловічий одяг', 'men', 'cat-men.jpg', ['Куртки й пальта', 'Джинси', 'Худі та світшоти', 'Футболки'], 'Чоловіче'],
    ['Взуття', 'shoes', 'cat-shoes.jpg', ['Кросівки', 'Черевики', 'Туфлі'], 'Взуття'],
    ['Смартфони', 'phones', 'cat-phones.jpg', ['Apple', 'Samsung', 'Xiaomi', 'Google'], 'Смартфони'],
    /* розділи нижче — припущення для макета: показати, як вітрина живе, коли розділів більше; остаточний список дає замовник */
    ['Сумки й аксесуари', 'bags', 'cat-bags.jpg', ['Сумки', 'Рюкзаки', 'Ремені', 'Шарфи й шапки'], 'Сумки'],
    ['Дитячі речі', 'kids', 'cat-kids.jpg', ['Одяг', 'Взуття', 'Іграшки', 'Візочки'], 'Дитячі'],
    ['Електроніка', 'tech', 'cat-electronics.jpg', ['Ноутбуки', 'Навушники', 'Планшети', 'Фото й відео'], 'Електроніка'],
    ['Дім і сад', 'home', 'cat-home.jpg', ['Меблі', 'Посуд', 'Освітлення', 'Рослини'], 'Дім']
  ];
  var NAVCATS = CATS.slice(0, 5);   /* у текстовому рядку шапки (комп'ютер, усі сторінки, крім головної) — перші розділи, решта в «Усі категорії» */
  function icons() { if (window.lucide) lucide.createIcons(); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  /* комп'ютер (22.11.2026, огляд усіх екранів): пошук — у шапці, тому окрема сторінка пошуку веде в каталог;
     «Усі категорії», вибір розділу й розмова отримують шапку сайту замість вигляду телефона */
  if (wide.matches && page === 'search.html') { location.replace('catalog.html' + (q.get('q') ? '?q=' + encodeURIComponent(q.get('q')) : '')); return; }
  /* у «Чаті» на комп'ютері розмова відкрита віконцем справа (iframe) — там шапка не потрібна */
  if (wide.matches && (page === 'category.html' || page === 'dialog.html') && !$('header.top') && window.self === window.top) {
    document.body.classList.add('wide', 'deskhead');
    document.body.insertBefore(el('<header class="top"><div class="top-row"><a class="wordmark" href="home.html"><span class="hw"><span class="tagx">TRAD</span></span></a><nav class="desk" aria-label="Меню"><a class="icon-btn" href="favorites.html" aria-label="Обране"><i data-lucide="heart"></i></a><a class="icon-btn" href="chat.html" aria-label="Чат"><i data-lucide="message-circle"></i><span class="dot"></span></a><a class="icon-btn" href="notifications.html" aria-label="Сповіщення"><i data-lucide="bell"></i></a><a class="icon-btn" href="profile.html" aria-label="Профіль"><i data-lucide="user"></i></a><a class="btn primary cta" href="create-ai.html"><i data-lucide="plus"></i>Додати оголошення</a></nav></div><form class="search" role="search" action="catalog.html"><i data-lucide="search"></i><input type="search" name="q" placeholder="Що шукаєте?" aria-label="Пошук оголошень"><a class="where" href="city.html"><i data-lucide="map-pin"></i>Вся Україна</a></form></header>'), document.body.firstChild);
  }
  var holders = [];
  function shut(except) { holders.forEach(function (h) { if (h !== except) { h.classList.remove('open'); var b = $('button', h); if (b) b.setAttribute('aria-expanded', 'false'); } }); }
  function holder(h, hover) {
    holders.push(h);
    var b = $('button', h);
    b.addEventListener('click', function (e) { e.stopPropagation(); shut(h); b.setAttribute('aria-expanded', String(h.classList.toggle('open'))); });
    if (hover) { h.addEventListener('mouseenter', function () { shut(h); h.classList.add('open'); }); h.addEventListener('mouseleave', function () { h.classList.remove('open'); }); }
  }
  document.addEventListener('click', function () { shut(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') shut(); });

  /* ---------- шапка на комп'ютері: меню профілю або «Увійти» для гостя ---------- */
  var desk = $('header.top nav.desk');
  if (desk) {
    /* комп'ютер: поруч зі знаком — головні шляхи сайту */
    var wm = $('header.top .wordmark');
    if (wm && !$('.topnav')) wm.after(el('<nav class="topnav" aria-label="Головне меню"><a href="help.html">Про TRAD</a></nav>'));
    var prof = $('[aria-label="Профіль"]', desk);
    if (q.get('guest') === '1') {
      $$('.icon-btn', desk).forEach(function (b) { b.remove(); });
      desk.insertBefore(el('<a class="loginbtn" href="login.html?next=' + page + '">Увійти</a>'), desk.firstChild);
    } else if (prof) {
      var me = el('<div class="pmenu" id="me"><button class="mebtn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Меню профілю"><img src="assets/avatar.jpg" alt="">Олена<i data-lucide="chevron-down"></i></button>'
        + '<div class="drop" role="menu"><a class="who" href="profile.html"><img src="assets/avatar.jpg" alt=""><span><b>Олена</b><small>+380 67 123 45 67 · Одеса</small></span></a>'
        + '<a href="my.html"><i data-lucide="layout-list"></i>Мої оголошення<small>3 активні</small></a>'
        + '<a href="ai-studio.html"><i data-lucide="sparkles"></i>AI-студія</a>'
        + '<a href="favorites.html"><i data-lucide="heart"></i>Обране<small>4</small></a>'
        + '<a href="chat.html"><i data-lucide="message-circle"></i>Чат<small>2 нових</small></a><hr>'
        + '<a href="profile.html"><i data-lucide="settings"></i>Профіль і налаштування</a>'
        + '<a href="help.html"><i data-lucide="circle-help"></i>Допомога</a><hr>'
        + '<a href="login.html"><i data-lucide="log-out"></i>Вийти</a></div></div>');
      prof.replaceWith(me); holder(me);
    }
  }

  /* ---------- рядок розділів під шапкою (вітрина, комп'ютер) ---------- */
  var SHOP = ['home.html', 'catalog.html', 'product.html', 'seller.html', 'favorites.html', 'search.html'];
  var top = $('header.top');
  if (top && SHOP.indexOf(page) >= 0) {
    /* «Усі категорії» — повний список розділів із підкатегоріями; у рядку далі лише головні розділи (до восьми) */
    var nav = el('<nav class="catnav" aria-label="Розділи"><div class="ca"><button class="cb allc" type="button" aria-haspopup="true" aria-expanded="false"><i data-lucide="layout-grid"></i>Усі категорії</button><div class="drop mega" role="menu">'
      + CATS.map(function (c) {
        return '<div class="mcol"><a class="all" href="catalog.html?cat=' + c[1] + '">' + c[0] + '</a>'
          + c[3].map(function (s) { return '<a href="catalog.html?cat=' + c[1] + '&sub=' + encodeURIComponent(s) + '">' + s + '</a>'; }).join('') + '</div>';
      }).join('') + '</div></div>' + NAVCATS.map(function (c) {
      return '<div class="ci"><button class="cb" type="button" aria-haspopup="true" aria-expanded="false">' + c[0] + '<i data-lucide="chevron-down"></i></button><div class="drop" role="menu"><a class="all" href="catalog.html?cat=' + c[1] + '">Усе в розділі</a>'
        + c[3].map(function (s) { return '<a href="catalog.html?cat=' + c[1] + '&sub=' + encodeURIComponent(s) + '">' + s + '</a>'; }).join('') + '</div></div>';
    }).join('') + '</nav>');
    top.after(nav);
    $$('.ci, .ca', nav).forEach(function (h) { holder(h, true); });
  }

  /* ---------- телефон: темний верх зі знаком, пошуком і дзвіночком — як на головній — у каталозі й на сторінці оголошення ---------- */
  if (top && (page === 'catalog.html' || page === 'product.html' || page === '404.html')) {
    document.body.classList.add('dk');
    if (page === 'catalog.html') document.body.classList.add('dkfix');
    var dkw = $('.top-row .wordmark', top);
    if (dkw && !$('.top-row > .icon-btn', top)) dkw.after(el('<a class="icon-btn" href="notifications.html" aria-label="Сповіщення"><i data-lucide="bell"></i><span class="dot"></span></a>'));
  }

  if (page === 'product.html' && q.get('sold') === '1') document.body.classList.add('is-sold');
  if (page === 'favorites.html' && q.get('empty') === '1') { var fnum = $('.tline [data-tab="items"] .num'); if (fnum) fnum.textContent = '0'; }
  if (page === 'chat.html' && q.get('empty') === '1') document.body.classList.add('nochats');

  /* ---------- «Усі категорії» на телефоні: той самий список, що й під час створення, але веде в каталог ---------- */
  if (page === 'category.html' && q.get('browse') === '1') {
    var cttl = $('#ttl'), croot = $('#root'), cback = $('#back');
    var ctitle = function () { if (croot && !croot.hidden && cttl) cttl.textContent = 'Усі категорії'; };
    if (cback) cback.setAttribute('href', 'home.html');
    $$('[data-level]').forEach(function (sec) {
      var c = CATS[+sec.dataset.level]; if (!c) return;
      $$('a.lrow', sec).forEach(function (a) {
        var t = a.textContent.trim();
        if (c[3].indexOf(t) < 0) { a.remove(); return; }
        a.setAttribute('href', 'catalog.html?cat=' + c[1] + '&sub=' + encodeURIComponent(t));
      });
      sec.insertBefore(el('<a class="lrow allrow" href="catalog.html?cat=' + c[1] + '"><span class="t">Усе в розділі</span></a>'), sec.firstChild);
    });
    /* у списку розділів — та сама картинка, що й на головній */
    $$('#root .lrow').forEach(function (r) { var c = CATS[+r.dataset.open]; if (c && !$('.ph', r)) r.insertBefore(el('<span class="ph"><img src="assets/' + c[2].replace('cat-', 'obj-') + '" alt=""></span>'), r.firstChild); });
    /* розділи, яких немає в розмітці сторінки, ведуть одразу в каталог: підкатегорії там рядком угорі */
    CATS.slice($$('#root .lrow').length).forEach(function (c) {
      croot.appendChild(el('<a class="lrow" href="catalog.html?cat=' + c[1] + '"><span class="ph"><img src="assets/' + c[2].replace('cat-', 'obj-') + '" alt=""></span><span class="t">' + c[0] + '</span><i data-lucide="chevron-right"></i></a>'));
    });
    var CNT = { women: 128, men: 6 };
    $$('#root .lrow').forEach(function (r, i) { var c = CATS[i], t = $('.t', r); if (!c || !t || $('small', t)) return; var k = CNT[c[1]] || 4; t.appendChild(el('<small>' + k + (k < 5 ? ' оголошення' : ' оголошень') + '</small>')); });
    document.addEventListener('click', function () { setTimeout(ctitle, 0); });
    ctitle();
    /* сюди приходять із пункту «Категорії» нижнього меню — меню лишається на місці */
    if (!$('nav.tabs') && !wide.matches) {
      document.body.appendChild(el('<nav class="tabs" aria-label="Головне меню"><a class="tab" href="home.html"><i data-lucide="house"></i>Головна</a><a class="tab" href="favorites.html"><i data-lucide="heart"></i>Обране</a>'
        + '<a class="tab create" href="create-ai.html"><span class="plus"><i data-lucide="tag"></i></span>Створити</a><a class="tab" href="chat.html"><i data-lucide="message-circle"></i><span class="count num">2</span>Чат</a>'
        + '<a class="tab" href="profile.html"><i data-lucide="user"></i>Профіль</a></nav>'));
      document.body.classList.add('browse');
    }
  }

  /* ---------- вхід: шлях назад до оголошень; кабінет: швидке редагування ---------- */
  if (page === 'login.html') {
    var toshop = el('<a class="toshop" href="home.html">Дивитися без входу<i data-lucide="x"></i></a>'), send1 = $('.step[data-step="1"] #send');
    if (!wide.matches && send1) { toshop.classList.add('inform'); send1.after(toshop); } else document.body.appendChild(toshop);
    /* телефон: знак-бирка прив'язана шнурком до кута картки з формою (на комп'ютері знак лишається ліворуч угорі сторінки) */
    var lgn = $('main.login'), wm0 = $('.authbrand .wordmark');
    if (lgn && wm0) {
      var ctag = el('<div class="cardtag"></div>');
      ctag.appendChild(wm0.cloneNode(true));
      ctag.appendChild(el('<img class="cord" src="assets/tag-cord.png" alt="">'));
      lgn.insertBefore(ctag, lgn.firstChild);
    }
    var ph1 = $('.step[data-step="1"] .phone');
    if (ph1) ph1.before(el('<span class="flabel">Номер телефону</span>'));
  }
  /* мої оголошення: у рядку одне меню «⋮»; «Редагувати» в ньому веде до форми */
  if (page === 'my.html') { var actEdit = $$('#acts .lrow').filter(function (x) { return /Редагувати/.test(x.textContent); })[0]; if (actEdit) actEdit.addEventListener('click', function () { location.href = 'create.html?step=2'; }); }

  /* ---------- пошук: явна дія «Шукати …» і область пошуку в підказках ---------- */
  if (page === 'search.html') {
    var sq = $('#q'), sugg = $('#sugg');
    if (sq && sugg) {
      var goRow = el('<a class="lrow go" href="catalog.html"><i data-lucide="search"></i><span class="t">Шукати «<b></b>»<small>У всіх категоріях</small></span><i data-lucide="arrow-right"></i></a>');
      sugg.insertBefore(goRow, sugg.firstChild);
      var setGo = function () { var v = sq.value.trim(); $('b', goRow).textContent = v; goRow.setAttribute('href', 'catalog.html?q=' + encodeURIComponent(v)); goRow.hidden = !v; };
      sq.addEventListener('input', setGo); setGo();
    }
  }

  /* ---------- список розмов: про що розмова видно з фото товару ---------- */
  if (page === 'chat.html') {
    var PH = [['Джинси', 'jeans-1.jpg'], ['Сумка', 'bag.jpg'], ['iPhone', 'phone.jpg'], ['Туфлі', 'shoes.jpg'], ['Худі', 'hoodie.jpg']];
    $$('.crow').forEach(function (r) {
      var it = $('.item', r), av = $('.ava', r); if (!it || !av || av.classList.contains('withitem')) return;
      it.textContent = it.textContent.replace(/^Ваше оголошення:\s*/, 'Продаю · ');
      var hit = PH.filter(function (x) { return it.textContent.indexOf(x[0]) >= 0; })[0]; if (!hit) return;
      var mini = el('<span class="mini-ava"></span>'); while (av.firstChild) mini.appendChild(av.firstChild);
      av.appendChild(el('<img class="it" src="assets/' + hit[1] + '" alt="">')); av.appendChild(mini); av.classList.add('withitem');
    });
  }

  /* ---------- розмова: месенджери продавця поруч із полем ---------- */
  if (page === 'dialog.html' && +q.get('offer') > 0) {
    var lastMsg = $$('.msg').pop();
    if (lastMsg) lastMsg.after(el('<div class="msg out">Пропоную ' + String(+q.get('offer')).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0грн. Що скажете?<span class="mt num">щойно</span></div>'));
  }
  if (page === 'dialog.html') {
    var cbox = $('.cbox');
    if (cbox) {
      var via = el('<div class="viaapp"><span>Продавець також відповідає в</span><a class="tg" href="#" data-app="Telegram" aria-label="Написати в Telegram"><img src="assets/icons/telegram-white.svg" alt=""></a><a class="vb" href="#" data-app="Viber" aria-label="Написати у Viber"><img src="assets/icons/viber-white.svg" alt=""></a></div>');
      cbox.insertBefore(via, cbox.firstChild);
      via.addEventListener('click', function (e) {
        var a = e.target.closest('a'); if (!a) return; e.preventDefault();
        var t = $('#toast'); if (!t) { t = el('<div class="toast" id="toast" role="status"></div>'); document.body.appendChild(t); }
        t.textContent = 'Відкриваємо ' + a.dataset.app; t.classList.add('on'); setTimeout(function () { t.classList.remove('on'); }, 2200);
      });
    }
  }

  /* ---------- продавець: підтверджений телефон і вихід до всіх оголошень; обране: лише доступні ---------- */
  if (page === 'seller.html') {
    var pn = $('.phead .sub'); if (pn) pn.after(el('<span class="vbadge"><i data-lucide="shield-check"></i>Телефон підтверджено</span>'));
    var sg = $('main .grid'); if (sg) { sg.classList.add('hasmore'); sg.after(el('<div class="morebox"><a class="morelink" href="home.html">Усі оголошення TRAD<i data-lucide="chevron-right"></i></a></div>')); }
  }
  if (page === 'favorites.html') {
    var fg = $('main .grid'), ftools = $('#tools');
    if (ftools) ftools.hidden = true;          /* число оголошень уже є у вкладці «Оголошення 4» */
    if (fg && $$('.card', fg).length) {
      var ff = el('<div class="favflt" aria-label="Показати"><button class="qchip" type="button" aria-pressed="true">Усі</button><button class="qchip" type="button" aria-pressed="false">Доступні</button></div>');
      fg.before(ff);
      ff.addEventListener('click', function (e) {
        var b = e.target.closest('.qchip'); if (!b) return;
        var only = b.textContent === 'Доступні';
        $$('.qchip', ff).forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        $$('.card', fg).forEach(function (c) { var st = $('.state', c); c.hidden = only && !!st && /Продано|Неактивне/.test(st.textContent); });
      });
    }
  }
  if (page === 'my.html') { var qc = $('#qcard'); if (qc && !$('.qx', qc)) { qc.appendChild(el('<button class="qx" type="button" aria-label="Закрити"><i data-lucide="x"></i></button>')); $('.qx', qc).addEventListener('click', function () { qc.hidden = true; }); } }

  /* ---------- сповіщення: вхід у налаштування ---------- */
  if (page === 'notifications.html') $$('.nrow').forEach(function (r) { var tx = $('.tx', r); if (tx && /знято з публікації/.test(r.textContent) && !$('.mini', r)) tx.after(el('<a class="mini" href="create.html?step=2">Виправити оголошення</a>')); });
  if (page === 'notifications.html') $$('.nrow .tt').forEach(function (t) { if (/відповіла$/.test(t.textContent.trim())) t.textContent = t.textContent.trim() + ' щодо «Джинси Levi’s 501»'; });
  if (page === 'notifications.html') { var nbar = $('.bar'), ra = $('#readall'); if (nbar && ra) ra.before(el('<a class="act" href="notify.html" aria-label="Налаштування сповіщень"><i data-lucide="settings"></i></a>')); }

  /* ---------- головна ---------- */
  if (page === 'home.html') {
    document.body.classList.add('home');
    var chips = $('nav.chips'); if (chips) chips.remove();
    var main = $('main'), head = $('.head', main), grid = $('.grid', main);
    /* розділи — картинки з підписом (як у OLX і Kleinanzeigen); перша плитка — «Усі категорії», вона завжди на виду.
       Телефон: один ряд, що гортається вбік, коли розділів стане більше п'яти; плитка веде на екран з усіма розділами.
       Комп'ютер: той самий ряд замість текстового рядка розділів у шапці; «Усі категорії» розкриває повний список. */
    /* розділи на головній: заголовок «Розділи» і картинки з підписами; натиск одразу відкриває оголошення розділу
       (панелі з підрозділами немає: при 3–5 підрозділах це зайвий крок, підрозділи видно рядком у самому розділі).
       Телефон: сітка 4 x 2 — перші вісім розділів, «Усі категорії» посиланням біля заголовка. Комп'ютер: вісім рівних колонок. */
    /* телефон: на головній перші вісім розділів, решта — за «Усі категорії»; комп'ютер: усі розділи, по вісім у ряд */
    var TSHORT = { women: 'Жінкам', men: 'Чоловікам' };   /* телефон: підпис плитки в один рядок */
    var catsNav = el('<nav class="cats" aria-label="Розділи">' + (wide.matches ? CATS : CATS.slice(0, 8)).map(function (c) {
      return '<a href="catalog.html?cat=' + c[1] + '"><span class="ph"><img src="assets/' + c[2].replace('cat-', 'obj-') + '" alt=""></span><span class="lb">' + ((!wide.matches && TSHORT[c[1]]) || (c[1] === 'bags' ? c[4] : c[0])) + '</span></a>';
    }).join('') + '</nav>');
    main.insertBefore(catsNav, head);
    /* обкладинка головної: що робить TRAD для продавця — фото, а решту заповнює AI */
    main.insertBefore(el('<section class="hero" aria-label="Про TRAD"><div class="hin"><h1>Сфотографуйте. <b>AI</b> зробить решту.</h1>'
      + '<p>Додайте фото — AI заповнить оголошення і збере з них відео.</p>'
      + '<a class="btn primary" href="create-ai.html">Продати з AI<i data-lucide="arrow-right"></i></a>'
      + '<div class="hart" aria-hidden="true"><img src="assets/hero-ai.webp" alt="">'
      + '<ul class="hvis"><li><i data-lucide="sparkles"></i>Розпізнає товар</li><li><i data-lucide="file-text"></i>Заповнить опис</li><li><i data-lucide="tag"></i>Підкаже ціну</li><li><i data-lucide="clapperboard"></i>Збере відео з фото</li></ul></div><span class="hhand" aria-hidden="true"><img src="assets/hero-hand.webp" alt=""></span></div></section>'), main.firstChild);
    catsNav.before(el('<div class="catshead"><h2>Розділи</h2><a class="allcat" href="category.html?browse=1">Дивитися всі<i data-lucide="arrow-right"></i></a></div>'));
    var pill = $('.pill', head), box = el('<div class="headr"><select class="sortsel" id="hsort" aria-label="Сортування"><option value="new">Спочатку нові</option><option value="cheap">Спочатку дешевші</option><option value="dear">Спочатку дорожчі</option></select></div>');
    head.classList.add('wraps'); head.appendChild(box); box.appendChild(pill);
    /* телефон: регіон і фільтри — у рядку заголовка; сортування на головній немає, воно у фільтрах каталогу */
    head.appendChild(el('<div class="hr"><a class="rg" href="city.html"><i data-lucide="map-pin"></i><span>Вся Україна</span><i data-lucide="chevron-down"></i></a><a class="fb" href="catalog.html?filters=1" aria-label="Фільтри і сортування"><i data-lucide="sliders-horizontal"></i></a></div>'));
    var order0 = $$('.card', grid);
    function cost(c) { return +($('.price', c).textContent.replace(/\D/g, '')) || 0; }
    $('#hsort').addEventListener('change', function () {
      var v = this.value, list = $$('.card', grid);
      if (v === 'new') list.sort(function (a, b) { return (order0.indexOf(a) < 0 ? 99 : order0.indexOf(a)) - (order0.indexOf(b) < 0 ? 99 : order0.indexOf(b)); });
      else list.sort(function (a, b) { return v === 'cheap' ? cost(a) - cost(b) : cost(b) - cost(a); });
      list.forEach(function (c) { grid.appendChild(c); });
    });
    grid.classList.add('hasmore');
    var more = el('<div class="morebox"><button class="btn ghost" type="button" id="more">Показати ще</button><p class="endnote" hidden>Ви переглянули всі нові оголошення</p></div>'), shown = 0;
    grid.after(more);
    $('#more').addEventListener('click', function () {
      order0.slice(shown * 5, shown * 5 + 5).forEach(function (c) { var n = c.cloneNode(true); grid.appendChild(n); });
      shown++;
      if (shown >= 2) { this.hidden = true; $('.endnote', more).hidden = false; }
    });
    grid.addEventListener('click', function (e) {
      var f = e.target.closest('.fav'); if (!f || order0.indexOf(f.closest('.card')) >= 0) return;
      e.preventDefault(); f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true'));
    });
  }

  /* ---------- каталог: шлях і швидкі фільтри ---------- */
  if (page === 'catalog.html') {
    var h1 = $('h1.cat'), tools = $('.tools');
    /* приклади оголошень для розділів: у «Жіночому одязі» лишається стрічка зі сторінки, в інших розділах — свої товари */
    var CITEMS = {
      men: [['hoodie.jpg', '650', 'Худі сіре', 'Вживане · L', 'Київ · вчора'], ['tshirt.jpg', '250', 'Футболка з принтом', 'Нове · M', 'Одеса · 11 листопада'], ['jeans-black.jpg', '1 100', 'Джинси чорні слім', 'Вживане · W32 L34', 'Львів · сьогодні'], ['puffer-green.jpg', '1 700', 'Пуховик зелений', 'Вживане · L', 'Харків · вчора'], ['jeans-grey.jpg', '600', 'Джинси сірі прямі', 'Вживане · W31 L32', 'Дніпро · вчора'], ['boots.jpg', '2 200', 'Черевики зимові', 'Вживане · 43', 'Вінниця · вчора']],
      shoes: [['it-sneakers.jpg', '900', 'Кросівки білі шкіряні', 'Вживане · 39', 'Київ · сьогодні'], ['shoes.jpg', '1 350', 'Туфлі шкіряні', 'Вживане · 42', 'Дніпро · вчора'], ['boots.jpg', '2 200', 'Черевики зимові', 'Вживане · 41', 'Вінниця · вчора'], ['it-heels.jpg', '1 100', 'Ботильйони замшеві', 'Вживане · 38', 'Львів · вчора']],
      phones: [['phone.jpg', '9 800', 'iPhone 11, чорний', 'Вживане · 64 ГБ', 'Львів · сьогодні'], ['it-phone-3.jpg', '6 500', 'Samsung Galaxy A34, синій', 'Вживане · 128 ГБ', 'Київ · сьогодні'], ['it-phone-4.jpg', '7 200', 'iPhone XR, чорний', 'Вживане · 64 ГБ', 'Одеса · вчора'], ['it-phone-2.jpg', '3 200', 'iPhone SE, білий, з чохлом', 'Вживане · 64 ГБ', 'Харків · вчора']],
      bags: [['it-backpack.jpg', '700', 'Рюкзак міський сірий', 'Вживане', 'Львів · сьогодні'], ['it-crossbody.jpg', '850', 'Сумка через плече, чорна', 'Вживане', 'Одеса · сьогодні'], ['it-belt.jpg', '300', 'Ремінь шкіряний', 'Вживане · 105 см', 'Дніпро · вчора'], ['it-scarf.jpg', '250', 'Шарф вовняний', 'Нове', 'Харків · 11 листопада']],
      kids: [['it-kids-jacket.jpg', '450', 'Дощовик дитячий жовтий', 'Вживане · 104 см', 'Київ · сьогодні'], ['it-kids-shoes.jpg', '350', 'Кросівки дитячі', 'Вживане · 24', 'Львів · сьогодні'], ['it-kids-toy.jpg', '400', 'Потяг дерев’яний', 'Вживане', 'Одеса · вчора'], ['it-stroller.jpg', '3 200', 'Візочок прогулянковий', 'Вживане', 'Харків · вчора']],
      tech: [['it-laptop.jpg', '14 500', 'Ноутбук 14″, сірий', 'Вживане · 256 ГБ', 'Київ · сьогодні'], ['it-headphones.jpg', '1 800', 'Навушники накладні з чохлом', 'Вживане', 'Львів · сьогодні'], ['it-tablet.jpg', '5 400', 'Планшет 10″ з чохлом', 'Вживане · 64 ГБ', 'Дніпро · вчора'], ['it-camera.jpg', '3 900', 'Фотоапарат компактний', 'Вживане', 'Одеса · вчора']],
      home: [['it-lamp.jpg', '450', 'Лампа настільна біла', 'Вживане', 'Київ · сьогодні'], ['it-plates.jpg', '600', 'Набір тарілок, 8 предметів', 'Вживане', 'Харків · сьогодні'], ['it-chair.jpg', '900', 'Стілець дерев’яний', 'Вживане', 'Львів · вчора'], ['it-plant.jpg', '0', 'Вазон у горщику', 'Вживане', 'Вінниця · вчора']]
    };
    var citems = !q.get('q') && q.get('empty') !== '1' && CITEMS[q.get('cat')], cg0 = $('#grid');
    if (citems && cg0) {
      cg0.innerHTML = citems.map(function (x) {
        return '<a class="card" href="product.html"><div class="frame"><img src="assets/' + x[0] + '" alt=""><button class="fav" type="button" aria-pressed="false" aria-label="Додати в обране"><i data-lucide="heart"></i></button>'
          + '<div class="cap"><div class="price num">' + (x[1] === '0' ? 'Безкоштовно' : x[1].replace(/ /g, '&nbsp;') + '&nbsp;грн') + '</div><div class="title">' + x[2] + '</div><div class="attrs">' + x[3] + '</div></div></div><div class="meta">' + x[4] + '</div></a>';
      }).join('');
      cg0.addEventListener('click', function (e) { var f = e.target.closest('.fav'); if (!f) return; e.preventDefault(); f.setAttribute('aria-pressed', String(f.getAttribute('aria-pressed') !== 'true')); });
      var cn0 = $('#n'); if (cn0) cn0.textContent = citems.length + (citems.length < 5 ? ' оголошення' : ' оголошень');
    }
    var sq = (q.get('q') || '').trim();
    if (sq && h1) {                                 /* пошук: запит видно в полі й у заголовку */
      h1.textContent = 'Пошук: «' + sq + '»';
      $$('header.top .search input').forEach(function (i) { i.value = sq; });
    }
    if (h1) h1.before(el('<nav class="crumbs" aria-label="Шлях"><a href="home.html">Головна</a><i data-lucide="chevron-right"></i><span>' + (sq ? 'Пошук' : h1.textContent) + '</span></nav>'));
    var sheet = $('#sheet'), side = $('aside.side'), apply = $('#apply');
    if (tools && sheet && apply) {
      var quick = el('<div class="qflt" aria-label="Швидкі фільтри">'
        + '<button class="qchip" type="button" data-q="size">Розмір<i data-lucide="chevron-down"></i></button><button class="qchip" type="button" data-q="1" aria-pressed="false">Нове</button><button class="qchip" type="button" data-q="2" aria-pressed="false">Вживане</button>'
        + '<button class="qchip" type="button" data-q="price">Ціна<i data-lucide="chevron-down"></i></button></div>');
      tools.after(quick);
      if (!wide.matches) {
        var tn = $('.n', tools), tsort = $('.sortsel', tools), tfol = $('#follow', tools), topen = $('#openf');
        if (tsort) quick.insertBefore(tsort, quick.firstChild);
        if (topen) quick.insertBefore(topen, quick.firstChild);
        var cline = el('<div class="cline"></div>');
        if (tn) cline.appendChild(tn);
        if (tfol) { tfol.classList.remove('icon-btn'); tfol.classList.add('flw'); tfol.appendChild(el('<span class="off">Стежити за пошуком</span>')); tfol.appendChild(el('<span class="on">Стежите за пошуком</span>')); cline.appendChild(tfol); }
        quick.after(cline); tools.hidden = true;
      }
      var panel = function () { return wide.matches && side ? side : sheet; };
      var sync = function () {
        var p = panel(), cond = $$('.opts[data-single] .opt', p), sw = $('.sw', p);
        $$('.qchip', quick).forEach(function (b) {
          var k = b.dataset.q;
          if (k === 'size') { var ss = $$('.opts:not([data-single]) .opt[aria-pressed="true"]', p).map(function (x) { return x.textContent; }); b.firstChild.textContent = ss.length ? 'Розмір ' + ss.join(', ') : 'Розмір'; b.classList.toggle('set', !!ss.length); }
          else if (k !== 'price') b.setAttribute('aria-pressed', String(!!cond[+k] && cond[+k].getAttribute('aria-pressed') === 'true'));
        });
      };
      quick.addEventListener('click', function (e) {
        var b = e.target.closest('.qchip'); if (!b) return;
        var k = b.dataset.q, p = panel(), cond = $$('.opts[data-single] .opt', p);
        if (k === 'price' || k === 'size') { e.stopPropagation(); if (!(wide.matches && document.body.classList.contains('fopen'))) $('#openf').click(); var inp = $('[aria-label="Ціна до"]', p); if (inp && k === 'price') setTimeout(function () { inp.focus(); }, 350); return; }
        (cond[+k].getAttribute('aria-pressed') === 'true' ? cond[0] : cond[+k]).click();
        if (p === sheet) apply.click();
      });
      document.addEventListener('click', function () { setTimeout(sync, 60); });
      var cgrid = $('#grid'), cards0 = $$('.card', cgrid), cmore = el('<div class="morebox"><p class="endnote" id="shown"></p><button class="btn ghost" type="button" id="more">Показати ще</button></div>'), extra = 0;
      var shownText = function () { var t = parseInt($('#n').textContent, 10) || 0, s = Math.min(t, $$('.card', cgrid).length); $('#shown').textContent = 'Показано ' + s + ' зі ' + t; $('#more').hidden = s >= t || extra >= 2; };
      cgrid.classList.add('hasmore'); cgrid.after(cmore);
      $('#more').addEventListener('click', function (e) { e.stopPropagation(); cards0.forEach(function (c) { cgrid.appendChild(c.cloneNode(true)); }); extra++; shownText(); });
      document.addEventListener('click', function () { setTimeout(shownText, 90); }); setTimeout(shownText, 120);
      var hometab = $('nav.tabs .tab'); if (hometab) hometab.setAttribute('aria-current', 'page');
      setTimeout(sync, 80);
    }
  }

  /* ---------- картка товару ---------- */
  if (page === 'product.html') {
    var pmain = $('.pwrap main'), info = $('.info', pmain), media = $('section.media'), gallery = $('#gallery');
    if (pmain && info) pmain.insertBefore(el('<nav class="crumbs" aria-label="Шлях"><a href="catalog.html?cat=women">Жіночий одяг</a><i data-lucide="chevron-right"></i><a href="catalog.html?cat=women&sub=' + encodeURIComponent('Джинси') + '">Джинси</a></nav>'), pmain.firstChild);
    var specs = $$('.specs dd'), sblock = specs.length ? specs[0].closest('.block') : null, facts = $('.facts', info);
    if (specs.length && specs.length <= 4 && facts) {
      facts.before(el('<div class="pchips" aria-label="Характеристики">' + specs.map(function (d) { return '<span>' + d.textContent + '</span>'; }).join('') + '</div>'));
      if (!wide.matches) sblock.classList.add('folded');
    }
    /* комп'ютер, за рисунком: шлях над усією сторінкою, місто й дата — плашками під фото, характеристики — списком зі значками */
    if (wide.matches) {
      var pw = $('.pwrap'), cr = $('.crumbs', pmain);
      if (pw && cr) { cr.insertBefore(el('<i data-lucide="chevron-right"></i>'), cr.firstChild); cr.insertBefore(el('<a href="home.html">Головна</a>'), cr.firstChild); pw.insertBefore(cr, pw.firstChild); }
      if (facts && media) setTimeout(function () { media.appendChild(facts); }, 0);
      /* кнопки зв'язку: головна «Написати в чат», поруч спокійна «Запропонувати ціну», месенджери — малими значками нижче */
      setTimeout(function () {
        var ct = $$('aside.contact').filter(function (a) { return a.id !== 'ownbar'; })[0], ob = $('.offerbtn');
        if (ct && ob) ct.appendChild(ob);
        var sl = $('.safeline'); if (sl && media) { sl.classList.add('safebar'); media.appendChild(sl); }
        var ml = $('.pbelow .morelink.under'); if (ml) ml.firstChild.textContent = 'Дивитися всі';
      }, 0);   /* після того, як фото загорнуто в .stage */
      var SI = { 'Стан': 'sparkles', 'Бренд': 'tag', 'Розмір': 'ruler', 'Колір': 'palette' };
      $$('.specs dt').forEach(function (t) { t.insertBefore(el('<i data-lucide="' + (SI[t.textContent.trim()] || 'circle') + '"></i>'), t.firstChild); });
      $$('.pchips span', info).forEach(function (x, i) { if (i !== 0 && i !== 2) x.hidden = true; });
    }
    var sname = $('.seller .name');
    if (sname) sname.after(el('<span class="vbadge"><i data-lucide="shield-check"></i>Телефон підтверджено</span>'));
    var ssub = $('.seller .sub'); if (ssub && ssub.textContent.indexOf('з жовтня ·') >= 0) ssub.textContent = ssub.textContent.replace('з жовтня ·', 'з жовтня 2026 ·');
    if (media && gallery) {
      var slides = $$('.slide', gallery), stage = el('<div class="stage"></div>');
      while (media.firstChild) stage.appendChild(media.firstChild);
      media.appendChild(stage); media.classList.add('hasthumbs');
      var count = el('<span class="gcount num">1 / ' + slides.length + '</span>'); stage.appendChild(count);
      stage.appendChild(el('<button class="garrow prev" type="button" aria-label="Попереднє фото"><i data-lucide="chevron-left"></i></button>'));
      stage.appendChild(el('<button class="garrow next" type="button" aria-label="Наступне фото"><i data-lucide="chevron-right"></i></button>'));
      var thumbs = el('<div class="thumbs" aria-label="Фото й відео">' + slides.map(function (s, i) {
        return '<button type="button" aria-label="' + (i ? 'Фото ' + i : 'Відео') + '"' + (i ? '' : ' aria-current="true"') + '><img src="' + $('img', s).getAttribute('src') + '" alt="">' + (i ? '' : '<i data-lucide="play"></i>') + '</button>';
      }).join('') + '</div>');
      media.appendChild(thumbs);
      var cur = 0, go = function (i) { gallery.scrollTo({ left: Math.max(0, Math.min(slides.length - 1, i)) * gallery.clientWidth, behavior: 'smooth' }); };
      $$('button', thumbs).forEach(function (b, i) { b.addEventListener('click', function () { go(i); }); });
      $('.prev', stage).addEventListener('click', function () { go(cur - 1); });
      $('.next', stage).addEventListener('click', function () { go(cur + 1); });
      gallery.addEventListener('scroll', function () {
        cur = Math.round(gallery.scrollLeft / gallery.clientWidth);
        count.textContent = (cur + 1) + ' / ' + slides.length;
        $$('button', thumbs).forEach(function (b, i) { if (i === cur) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current'); });
      }, { passive: true });
    }
    if (gallery) {
      var pz = el('<div class="pzoom" hidden><button class="round" type="button" aria-label="Закрити"><i data-lucide="x"></i></button><img alt=""></div>');
      document.body.appendChild(pz);
      var pzoff = function () { pz.hidden = true; };
      pz.addEventListener('click', pzoff);
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pzoff(); });
      $$('.slide', gallery).forEach(function (sl) {
        if ($('.play', sl)) return;                 /* перший кадр — відео, його вмикає своя кнопка */
        var im = $('img', sl); if (!im) return;
        im.style.cursor = 'zoom-in';
        im.addEventListener('click', function () { $('img', pz).src = im.getAttribute('src'); pz.hidden = false; });
      });
    }
    var ptitle = info ? $('h1', info) : null, pprice = info ? $('.price', info) : null;
    if (ptitle && pprice && q.get('own') !== '1') {
      var obase = +(pprice.textContent.replace(/\D/g, '')) || 0, ostep = obase >= 2000 ? 100 : 50;
      var osug = [0.95, 0.9, 0.85].map(function (k) { return Math.round(obase * k / ostep) * ostep; }).filter(function (v, i, arr) { return v > 0 && v < obase && arr.indexOf(v) === i; });
      var ofmt = function (v) { return String(v).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0грн'; };
      var ob = el('<button class="offerbtn" type="button"><i data-lucide="hand-coins"></i><span>Запропонувати ціну</span></button>');
      ptitle.after(ob);
      var osh = el('<div class="osh" hidden><div class="oscrim"></div><section class="obox" role="dialog" aria-modal="true" aria-label="Запропонувати ціну">'
        + '<div class="sheet-head"><h2>Ваша ціна</h2><button class="x" type="button" aria-label="Закрити"><i data-lucide="x"></i></button></div>'
        + '<label class="ofield"><input class="num" id="oprice" inputmode="numeric" autocomplete="off" aria-label="Ваша ціна, грн"><span>грн</span></label>'
        + '<div class="ochips">' + osug.map(function (v) { return '<button class="qchip" type="button" data-v="' + v + '">' + ofmt(v) + '</button>'; }).join('') + '</div>'
        + '<p class="ohint" id="ohint"></p><button class="btn primary wide" type="button" id="osend">Надіслати продавцю</button></section></div>');
      document.body.appendChild(osh);
      var oin = $('#oprice', osh), osend = $('#osend', osh), ohint = $('#ohint', osh);
      var ocheck = function () {
        var v = +(oin.value.replace(/\D/g, '')) || 0, ok = v > 0 && v < obase;
        osend.disabled = !ok;
        ohint.textContent = v >= obase ? 'Запропонуйте менше, ніж ' + ofmt(obase) + '.' : 'Продавець просить ' + ofmt(obase) + '. Вашу пропозицію він побачить у чаті TRAD.';
        $$('.qchip', osh).forEach(function (c) { c.setAttribute('aria-pressed', String(+c.dataset.v === v)); });
        return ok ? v : 0;
      };
      var oclose = function () { osh.hidden = true; };
      ob.addEventListener('click', function () {
        if (q.get('guest') === '1') { location.href = 'login.html?next=product.html'; return; }
        oin.value = String(osug[1] || osug[0] || ''); ocheck(); osh.hidden = false;
      });
      oin.addEventListener('input', ocheck);
      osh.addEventListener('click', function (e) {
        var chip = e.target.closest('.qchip');
        if (chip) { oin.value = chip.dataset.v; ocheck(); return; }
        if (e.target.closest('.x') || e.target.classList.contains('oscrim')) oclose();
      });
      document.addEventListener('keydown', function (e) { if (e.key === 'Escape') oclose(); });
      osend.addEventListener('click', function () {
        var v = ocheck(); if (!v) return;
        oclose();
        ob.replaceWith(el('<a class="offerbtn sent" href="dialog.html?offer=' + v + '"><span>Ви запропонували ' + ofmt(v) + '</span><b>Відкрити чат</b></a>'));
      });
    }
    var sblk = $('.seller', pmain) ? $('.seller', pmain).closest('.block') : null;
    if (sblk && q.get('own') !== '1') sblk.appendChild(el('<p class="safeline"><i data-lucide="shield-alert"></i><span>TRAD не приймає оплату й не доставляє товар. Огляньте річ перед оплатою. <a href="rules.html">Правила безпеки</a></span></p>'));
    var foot = $('.foot', pmain);
    if (foot && q.get('own') !== '1') {
      var SIM = [['jeans-light.jpg', '750&nbsp;грн', 'Джинси мом, W30 L30', '0:20'], ['jeans-black.jpg', '1&nbsp;100&nbsp;грн', 'Джинси чорні слім, W32 L34', '0:15'], ['jeans-grey.jpg', '600&nbsp;грн', 'Джинси сірі прямі, W31 L32', ''], ['jeans-2.jpg', '1&nbsp;200&nbsp;грн', 'Джинси прямі, W28 L30', '0:22'], ['jeans-3.jpg', '700&nbsp;грн', 'Джинси сині, W30 L32', '']];
      var sellerMore = $$('.block', pmain).filter(function (b) { return $('.more', b); })[0];
      (sellerMore || foot).before(el('<section class="block"><h2>Схожі оголошення</h2><div class="more" id="similar">' + SIM.map(function (s) {
        return '<a class="card" href="product.html"><div class="frame"><img src="assets/' + s[0] + '" alt=""><span class="segs" aria-hidden="true"><i class="video"></i><i></i><i></i></span>'
          + '<div class="cap"><div class="price num">' + s[1] + '</div><div class="title">' + s[2] + '</div></div></div></a>';
      }).join('') + '</div><a class="morelink under" href="catalog.html?cat=women">Усі джинси<i data-lucide="chevron-right"></i></a></section>'));
    }
  }
  if (page === 'product.html') {
    var wrap = $('.pwrap'), pm = $('.pwrap main'), below = el('<div class="pbelow"></div>');
    if (wrap && pm) {
      wrap.after(below);
      var movers = $$('.block', pm).filter(function (b) { return $('.more', b); }).concat($$('.foot', pm)), marks = movers.map(function (m) { var c = document.createComment('shelf'); m.before(c); return c; });
      var place = function () { movers.forEach(function (m, i) { if (wide.matches) below.appendChild(m); else marks[i].after(m); }); };
      place(); wide.addEventListener('change', place);
    }
  }
  /* ---------- стан завантаження стрічки: ?loading=1 ---------- */
  if (q.get('loading') === '1' && (page === 'home.html' || page === 'catalog.html')) {
    var lg = page === 'home.html' ? $('main > .grid') : $('#grid');
    if (lg) { lg.innerHTML = new Array(9).join('<div class="card skel" aria-hidden="true"><div class="frame"></div><div class="meta"></div></div>'); lg.setAttribute('aria-busy', 'true'); var sh = $('.shelf'); if (sh) sh.hidden = true; var mb = $('.morebox'); if (mb) mb.hidden = true; }
  }
  /* ---------- картки в стрічках: рядок «стан · розмір» під назвою ---------- */
  $$('.card .title').forEach(function (t) {
    if ($('.attrs', t.parentNode)) return;
    var s = t.textContent, m = s.match(/,?\s*(?:розмір\s+([\w.]+)|(\d{2})\s+розмір|(W\d+\s?L\d+)|(\d+\s?ГБ))/i), size = m ? (m[1] || m[2] || m[3] || m[4]) : '';
    var cond = /принтом/i.test(s) ? 'Нове' : 'Вживане';
    if (m) t.textContent = s.replace(m[0], '').replace(/,\s*$/, '').trim();
    t.after(el('<div class="attrs">' + cond + (size ? ' · ' + size : '') + '</div>'));
  });
  /* ---------- картки в стрічках: фото чисте, ціна, назва й «стан · розмір · місто» під ним ----------
     Відео є в кожного оголошення (його склеєно з фото), тому на фото лише маленький значок відтворення.
     Сторінки збирають різні скрипти з розміткою «текст поверх фото» — до одного вигляду їх приводимо тут.
     Стіну оголошень на вході й заглушки завантаження не чіпаємо. */
  /* каталог на комп'ютері: кількість оголошень стоїть поруч із назвою розділу */
  (function () {
    var h = $('h1.cat'), n = $('#n');
    if (h && n && wide.matches) { var w = el('<div class="cathead"></div>'); h.before(w); w.appendChild(h); w.appendChild(n); }
    else if (h && page === 'catalog.html') {        /* телефон: заголовок розділу і місто в одному рядку, «назад» — на початку шляху */
      var w2 = el('<div class="cathead"></div>'); h.before(w2); w2.appendChild(h);
      w2.appendChild(el('<a class="ccity" href="city.html"><i data-lucide="map-pin"></i>Вся Україна<i data-lucide="chevron-down"></i></a>'));
      var cr2 = $('.shop .crumbs'); if (cr2) cr2.insertBefore(el('<a class="cback" href="home.html" aria-label="Назад"><i data-lucide="arrow-left"></i></a>'), cr2.firstChild);
      /* кількість оголошень — у рядку шляху; сортування — поруч зі «Стежити за пошуком»: рядок фільтрів лишається для самих фільтрів */
      var cl2 = $('.cline'), ss2 = $('.qflt .sortsel');
      if (cr2 && n) cr2.appendChild(n);
      if (cl2 && ss2) cl2.appendChild(ss2);
    }
  })();
  (function () {
    var hs = $('#hsort');
    if (!hs || !wide.matches || hs.options.length < 2) return;
    var seg = el('<div class="segsort" role="group" aria-label="Сортування"></div>');
    [].slice.call(hs.options, 0, 3).forEach(function (o, i) {
      var t = o.textContent.replace(/^Спочатку\s+/, ''); t = t.charAt(0).toUpperCase() + t.slice(1);
      var b = el('<button type="button"' + (i === hs.selectedIndex ? ' aria-pressed="true"' : ' aria-pressed="false"') + '>' + t + '</button>');
      b.addEventListener('click', function () {
        hs.selectedIndex = i; hs.dispatchEvent(new Event('change', { bubbles: true }));
        $$('button', seg).forEach(function (x, k) { x.setAttribute('aria-pressed', k === i ? 'true' : 'false'); });
      });
      seg.appendChild(b);
    });
    hs.addEventListener('change', function () { $$('button', seg).forEach(function (x, k) { x.setAttribute('aria-pressed', k === hs.selectedIndex ? 'true' : 'false'); }); });
    hs.before(seg); hs.classList.add('segged');
  })();
  function cardfix(c) {
    if (c.classList.contains('cv') || c.classList.contains('skel') || c.closest('.authwall')) return;
    var f = $('.frame', c), cap = $('.cap', c); if (!f || !cap) return;
    var d = $('.dur', f), segs = $('.segs', f), fav = $('.fav', f), meta = $('.meta', c), at = $('.attrs', cap), title = $('.title', cap);
    if (d) d.remove(); if (segs) segs.remove();
    if (meta) {                                   /* «Київ · сьогодні, 14:20» → «Київ · сьогодні»: година в стрічці зайва */
      meta.textContent = meta.textContent.split('·').map(function (x) { return x.trim().replace(/,\s*\d{1,2}:\d{2}$/, ''); }).join(' · ');
      meta.insertBefore(el('<i data-lucide="map-pin"></i>'), meta.firstChild);
      cap.appendChild(meta);
    }
    f.after(cap);
    f.appendChild(el('<span class="vmark" aria-hidden="true"><i data-lucide="play"></i></span>'));
    c.classList.add('cv');
  }
  $$('.card').forEach(cardfix);
  /* рамка фото в картці горизонтальна (4:3), а фото товарів вертикальні: беремо горизонтальний кадр «-w», де річ видно цілою */
  function widePhotos() {
    $$('.card.cv .frame img').forEach(function (im) {
      var src = im.getAttribute('src') || '', base = im.dataset.base || src;
      if (im.dataset.nowide || !/assets\/[a-z0-9-]+\.jpg$/.test(base) || /assets\/jeans-\d/.test(base)) return;
      im.dataset.base = base;
      var want = base.replace(/\.jpg$/, '-w.jpg');
      if (src === want) return;
      im.onerror = function () { im.onerror = null; im.dataset.nowide = '1'; im.src = base; };
      im.src = want;
    });
  }
  widePhotos();
  if ('MutationObserver' in window) {
    var wpT = 0;
    new MutationObserver(function () { if (!wpT) wpT = requestAnimationFrame(function () { wpT = 0; widePhotos(); }); }).observe(document.body, { childList: true, subtree: true });
  }
  /* доступні оголошення — першими: заброньовані й продані не мають стояти на початку стрічки */
  $$('#grid, main .grid').forEach(function (g) { $$('.card', g).filter(function (c) { return $('.state', c); }).forEach(function (c) { g.appendChild(c); }); });
  /* наступні оголошення підвантажуються самі, коли людина догортала; кнопка «Показати ще» лишається запасною */
  var moreBtn = $('#more');
  if (moreBtn && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !moreBtn.hidden) moreBtn.click(); }, { rootMargin: '0px 0px 300px 0px' }).observe(moreBtn);
  /* ---------- нижнє меню на телефоні: їде разом зі сторінкою, а не «стрибає» ----------
     Гортаємо вниз — меню з'їжджає за край рівно настільки, наскільки прогорнули; гортаємо вгору — так само повертається.
     Зупинилися — плавно стає на місце (так поводиться меню на сайті OLX). Якщо людина просила менше руху, меню не рухається. */
  /* нижнє меню телефона: другий пункт — «Категорії» (обраний власником варіант меню); «Обране» лишається в профілі */
  (function () {
    var ft = $('nav.tabs a.tab[href="favorites.html"]');
    if (!ft) return;
    ft.setAttribute('href', 'category.html?browse=1');
    ft.innerHTML = '<i data-lucide="layout-grid"></i>Категорії';
    if (page === 'category.html' || page === 'catalog.html') ft.setAttribute('aria-current', 'page'); else ft.removeAttribute('aria-current');
    var hometab = $('nav.tabs a.tab[href="home.html"]'); if (hometab && page === 'catalog.html') hometab.removeAttribute('aria-current');
    if (window.lucide) lucide.createIcons();
  })();
  var tabsNav = $('nav.tabs');
  if (tabsNav && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var navOff = 0, navY = Math.max(0, window.scrollY), navEnd, navRaf = 0;
    var navPaint = function () { navRaf = 0; tabsNav.style.setProperty('--nav-off', navOff + 'px'); };
    window.addEventListener('scroll', function () {
      var max = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
      var y = Math.min(Math.max(window.scrollY, 0), max), dy = y - navY;       /* без «гумового» відскоку iOS за краями сторінки */
      navY = y; if (!dy) return;
      if (!tabsNav.classList.contains('moving')) {                              /* підхоплюємо меню там, де воно зараз, навіть посеред повернення */
        var m = getComputedStyle(tabsNav).transform;
        navOff = m === 'none' ? 0 : parseFloat(m.split(',')[5]) || 0;
        tabsNav.classList.add('moving');
      }
      /* меню плаває над краєм екрана: ховаємо його повністю — на висоту, відступ знизу й тінь */
      navOff = Math.min(Math.max(navOff + dy, 0), tabsNav.offsetHeight + (parseFloat(getComputedStyle(tabsNav).bottom) || 0) + 44);
      if (!navRaf) navRaf = requestAnimationFrame(navPaint);
      clearTimeout(navEnd);
      navEnd = setTimeout(function () { tabsNav.classList.remove('moving'); navOff = 0; navPaint(); }, 380);
    }, { passive: true });
  }

  /* ================= функції після оцінки повноти (20 листопада 2026) ================= */
  (function () {
  var say = function (t) { if (typeof window.toast === 'function') window.toast(t); };

  /* ---------- 1 і 9. Розмова очима продавця (?as=seller): відповідь на пропозицію ціни, швидкі відповіді ---------- */
  if (page === 'chat.html') $$('.crow[data-kind="sell"]').forEach(function (a) { a.setAttribute('href', 'dialog.html?as=seller'); });
  if (page === 'dialog.html' && q.get('as') === 'seller') {
    document.body.classList.add('asseller');
    var sn = $('.dtop .nm'), sav = $('.dtop .ava'), sit = $('.dtop .ditem'), sms = $('#msgs'), smh = $('#dmenu h2');
    if (sn) { sn.textContent = 'Максим'; sn.removeAttribute('href'); }
    if (sav) { sav.innerHTML = '<span class="ltr">М</span>'; sav.removeAttribute('href'); }
    if (smh) smh.textContent = 'Розмова з Максимом';
    if (sit) { sit.setAttribute('href', 'product.html?own=1'); sit.innerHTML = '<img src="assets/bag.jpg" alt=""><span class="t">Сумка шкіряна, коричнева<span class="p num">1&nbsp;100&nbsp;грн</span></span><i data-lucide="chevron-right"></i>'; }
    if (sms) {
      sms.innerHTML = '<div class="safety"><i data-lucide="shield-alert"></i><span>Нікому не повідомляйте коди з SMS і дані картки. Гроші беріть під час зустрічі.</span></div>'
        + '<span class="daysep old">Сьогодні</span>'
        + '<div class="msg in old">Доброго дня! Сумка ще в продажу?<span class="mt num">12:03</span></div>'
        + '<div class="offer in" id="offer"><div class="of-h"><i data-lucide="hand-coins"></i>Максим пропонує свою ціну</div>'
        + '<div class="of-sum num"><b>950&nbsp;грн</b><s>1&nbsp;100&nbsp;грн</s></div>'
        + '<div class="of-acts"><button class="btn primary" type="button" data-of="ok">Прийняти</button><button class="btn ghost" type="button" data-of="own">Своя ціна</button><button class="btn ghost" type="button" data-of="no">Відхилити</button></div>'
        + '<form class="of-own" hidden><div class="pricebox"><input class="num" inputmode="numeric" value="1 000" aria-label="Ваша ціна"><span>грн</span></div><button class="btn primary" type="submit">Надіслати</button></form>'
        + '<p class="of-res" hidden></p></div>';
      var ofc = $('#offer'), ofa = $('.of-acts', ofc), ofo = $('.of-own', ofc), ofr = $('.of-res', ofc);
      var ofdone = function (cls, t) { ofa.hidden = true; ofo.hidden = true; ofr.hidden = false; ofr.textContent = t; ofc.classList.add(cls); };
      ofa.addEventListener('click', function (e) {
        var b = e.target.closest('[data-of]'); if (!b) return;
        if (b.dataset.of === 'ok') ofdone('ok', 'Ви погодилися на 950\u00a0грн. Домовтеся про зустріч.');
        else if (b.dataset.of === 'no') ofdone('no', 'Ви відхилили пропозицію. Ціна лишається 1\u00a0100\u00a0грн.');
        else { ofa.hidden = true; ofo.hidden = false; $('input', ofo).focus(); }
      });
      ofo.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = $('input', ofo).value.replace(/\D/g, ''); if (!v) return;
        ofdone('own', 'Ви запропонували ' + v.replace(/\B(?=(\d{3})+$)/g, '\u00a0') + '\u00a0грн. Чекаємо відповіді покупця.');
      });
    }
    var sq = ['Так, ще в продажу', 'Можу показати сьогодні', 'Можу відправити поштою'];
    $$('#quick button').forEach(function (b, i) { if (sq[i]) b.textContent = sq[i]; });
    var sqb = $('#quick'); if (sqb) sqb.hidden = false;
  }
  /* покупець бачить свою пропозицію й відповідь продавця (?offer=750&ans=ok|no|own) */
  if (page === 'dialog.html' && +q.get('offer') > 0 && q.get('as') !== 'seller') {
    var bo = String(+q.get('offer')).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0') + '\u00a0грн', ba = q.get('ans'), blast = $$('.msg').pop();
    var bres = ba === 'ok' ? 'Продавець погодився. Домовтеся про зустріч.' : ba === 'no' ? 'Продавець не погодився. Ціна лишається 900\u00a0грн.' : ba === 'own' ? 'Продавець пропонує 800\u00a0грн.' : 'Очікує відповіді продавця';
    if (blast) blast.after(el('<div class="offer out' + (ba ? ' ' + ba : '') + '"><div class="of-h"><i data-lucide="hand-coins"></i>Ваша пропозиція</div><div class="of-sum num"><b>' + bo + '</b><s>900&nbsp;грн</s></div><p class="of-res">' + bres + '</p>'
      + (ba === 'own' ? '<div class="of-acts"><button class="btn primary" type="button" data-say="Ви погодилися на 800\u00a0грн">Погодитися</button><button class="btn ghost" type="button" data-say="Ви відмовилися">Відмовитися</button></div>' : '') + '</div>'));
    $$('.offer [data-say]').forEach(function (b) { b.addEventListener('click', function () { var o = b.closest('.offer'); $('.of-acts', o).hidden = true; $('.of-res', o).textContent = b.dataset.say + '.'; }); });
  }
  /* повідомлення не пішло (?fail=1): видно, що продавець його не отримав, і можна надіслати ще раз */
  if (page === 'dialog.html' && q.get('fail') === '1') {
    var fl = $$('.msg').pop();
    if (fl) {
      fl.after(el('<div class="msg out failed">Можна подивитися сьогодні о 18:00?<span class="mt"><i data-lucide="circle-alert"></i>Не надіслано<button type="button" class="retry">Надіслати ще раз</button></span></div>'));
      $('.msg.failed .retry').addEventListener('click', function () { var m = $('.msg.failed'); m.classList.remove('failed'); $('.mt', m).innerHTML = 'щойно'; $('.mt', m).classList.add('num'); });
    }
  }

  /* ---------- 2. Створення оголошення: ті самі вісім розділів, що й на вітрині ---------- */
  if (page === 'category.html' && q.get('browse') !== '1' && typeof window.show === 'function' && window.names) {
    var cr0 = $('#root'), cback2 = q.get('from') === 'ai' ? 'create-ai.html?step=2' : 'create.html?step=2';
    CATS.slice($$('#root [data-open]').length).forEach(function (c) {
      var i = window.names.length; window.names.push(c[0]);
      var b = el('<button class="lrow" type="button" data-open="' + i + '"><span class="t">' + c[0] + '</span><i data-lucide="chevron-right"></i></button>');
      b.addEventListener('click', function () { window.show(i); });
      cr0.appendChild(b);
      cr0.parentNode.appendChild(el('<section class="listsec alist" data-level="' + i + '" hidden style="padding-top:8px">'
        + c[3].concat(['Інше']).map(function (n) { return '<a class="lrow" href="' + cback2 + '"><span class="t">' + n + '</span></a>'; }).join('') + '</section>'));
    });
  }

  /* ---------- 4, 5, 7. Сторінка оголошення: «Відправка поштою», «Показати номер», «Безкоштовно» ---------- */
  if (page === 'product.html') {
    var pf = $('.info .facts') || $('.facts');
    if (pf && !$('.ship', pf)) pf.appendChild(el('<span class="ship"><i data-lucide="package"></i>Відправка поштою</span>'));
    if (q.get('free') === '1') {
      document.body.classList.add('is-free');
      $$('.info .price').forEach(function (x) { x.textContent = 'Безкоштовно'; });
    }
    var pc = $$('aside.contact').filter(function (a) { return a.id !== 'ownbar'; })[0];
    if (pc && !$('.msgr.ph', pc)) {
      var pw = $('.msgr.wa', pc), pb = el('<button class="msgr ph" type="button" aria-label="Показати номер телефону"><i data-lucide="phone"></i></button>');
      if (pw) pw.after(pb); else pc.insertBefore(pb, pc.firstChild);
      var csh = el('<section class="sheet" id="callsh" style="display:none" role="dialog" aria-modal="true" aria-label="Номер продавця"><div class="sheet-head"><h2>Номер продавця</h2><button class="x" type="button" aria-label="Закрити"><i data-lucide="x"></i></button></div>'
        + '<div class="sheet-body callbody"><a class="callnum num" href="tel:+380671234567">+380 67 123 45 67</a><p>Олена · дзвінки з 9:00 до 21:00</p>'
        + '<a class="btn primary wide" href="tel:+380671234567"><i data-lucide="phone"></i>Подзвонити</a>'
        + '<p class="callnote"><i data-lucide="shield-alert"></i>Не переказуйте передоплату й не називайте коди з SMS.</p></div></section>');
      document.body.appendChild(csh);
      pb.addEventListener('click', function () {
        if (q.get('guest') === '1') { location.href = 'login.html?next=product'; return; }
        if (typeof window.openSheet === 'function') window.openSheet('callsh');
      });
      $('.x', csh).addEventListener('click', function () { if (typeof window.closeSheet === 'function') window.closeSheet(); });
    }
  }
  if (page === 'contacts.html') {
    var cw = $('.ways'), cch = cw && $('.ic.ch', cw);
    if (cw && !$('#ph', cw)) {
      var prow = el('<div class="crowin"><span class="ic ph"><i data-lucide="phone"></i></span><div class="f"><label for="ph">Дзвінки</label><input id="ph" class="num" inputmode="tel" value="+380 67 123 45 67" placeholder="Не показувати номер"></div></div>');
      if (cch) cch.closest('.crowin').before(prow); else cw.appendChild(prow);
    }
  }

  /* ---------- 4, 6, 7. Каталог: фільтри «З відправкою поштою» й «Віддають безкоштовно»; порожня видача ---------- */
  if (page === 'catalog.html') {
    $$('#sheet .fgroup, aside.side .fgroup').forEach(function (g) {
      var lb = $('.lbl', g); if (!lb || $('.xopt', g)) return;
      var t = lb.textContent.trim().indexOf('Ціна') === 0 ? 'Віддають безкоштовно' : lb.textContent.trim() === 'Місто' ? 'З відправкою поштою' : '';
      if (!t) return;
      var xb = el('<button class="opt xopt" type="button" aria-pressed="false">' + t + '</button>');
      xb.addEventListener('click', function () { xb.setAttribute('aria-pressed', String(xb.getAttribute('aria-pressed') !== 'true')); });
      g.appendChild(xb);
    });
    var em = $('#empty'), er = $('#reset2');
    if (em && er && !$('#efollow')) {
      var ecity = q.get('city'), eh = $('h2', em), ep = $('p', em), eact = el('<div class="eacts"></div>');
      er.before(eact);
      if (ecity) {
        if (eh) eh.textContent = 'У місті ' + ecity + ' нічого не знайшли';
        if (ep) ep.textContent = 'Пошукайте в інших містах: багато продавців відправляють поштою.';
        eact.appendChild(el('<a class="btn primary" href="catalog.html?cat=women">Шукати по всій Україні</a>'));
      }
      eact.appendChild(er);
      var ef = el('<button class="btn ghost" type="button" id="efollow"><i data-lucide="bell-plus"></i><span>Стежити за пошуком</span></button>');
      eact.appendChild(ef);
      em.appendChild(el('<p class="enote">Повідомимо, щойно з’явиться оголошення за цим пошуком.</p>'));
      ef.addEventListener('click', function () {
        var on = ef.getAttribute('aria-pressed') !== 'true'; ef.setAttribute('aria-pressed', String(on));
        $('span', ef).textContent = on ? 'Стежите за пошуком' : 'Стежити за пошуком';
      });
    }
  }

  /* ---------- 8. Мої оголошення: продане можна повернути в продаж ---------- */
  if (page === 'my.html') $$('[data-panel="sold"] .mrow .b').forEach(function (b) {
    if ($('.backsale', b)) return;
    var bs = el('<button class="mini backsale" type="button">Повернути у продаж</button>');
    bs.addEventListener('click', function () { var r = bs.closest('.mrow'); if (r) r.hidden = true; say('Оголошення знову в продажу'); });
    b.appendChild(bs);
  });

  /* ---------- 10. Підтримка: після надсилання видно номер звернення, статус і куди прийде відповідь ---------- */
  if (page === 'help.html') {
    var hb = $('.helpbox'), ss = $('#supsend');
    var tickets = function (fresh) {
      if ($('#tickets') || !hb) return;
      hb.after(el('<section class="tickets" id="tickets"><h2>Мої звернення</h2>'
        + (fresh ? '<div class="tk"><div class="tk-h"><b>№ 48 213 · ' + fresh + '</b><span class="tk-s wait">Очікує відповіді</span></div><p>Надіслано щойно. Відповімо протягом дня — у «Сповіщеннях» і повідомленням на +380 67 123 45 67.</p></div>' : '')
        + '<details class="tk"><summary class="tk-h"><b>№ 47 902 · Оголошення зняли</b><span class="tk-s ok">Відповіли 12 листопада</span></summary><p>Оголошення «Навушники бездротові» зняли через неправдиву назву моделі. Виправте назву й опублікуйте знову — перевірка триває до години.</p></details></section>'));
    };
    if (ss) ss.addEventListener('click', function () {
      setTimeout(function () {
        if (document.body.classList.contains('sheet-on')) return;      /* форму не надіслано: поле порожнє */
        var tp = $('#suptopic .opt[aria-pressed="true"]');
        var old = $('#tickets'); if (old) old.remove();
        tickets(tp ? tp.textContent.trim() : 'Звернення');
        var tk = $('#tickets'); if (tk) tk.scrollIntoView({ block: 'center' });
        icons();
      }, 0);
    });
    if (q.get('tickets') === '1') tickets('Не можу увійти');
  }
  })();
  /* ---- AI-студія — окремий розділ кабінету (22–23 листопада 2026): головна ai-studio.html, сторінка оголошення studio.html,
          стилі — tools/studio.css. Входи: меню кабінету й аватара, «Профіль» на телефоні, «⋮ → Відкрити в AI-студії», сповіщення ---- */
  (function () {
    var inStudio = page === 'ai-studio.html' || page === 'studio.html';
    $$('aside.acct nav').forEach(function (nav) {
      var my = $('a[href="my.html"]', nav);
      if (my && !$('a[href="ai-studio.html"]', nav)) my.after(el('<a href="ai-studio.html"><i data-lucide="sparkles"></i>AI-студія</a>'));
      if (inStudio) $$('a', nav).forEach(function (x) { if (x.getAttribute('href') === 'ai-studio.html') x.setAttribute('aria-current', 'page'); else x.removeAttribute('aria-current'); });
    });
    if (page === 'profile.html') {
      var mr = $('main .group a[href="my.html"]');
      if (mr && !$('#aiprof')) mr.after(el('<a class="lrow" id="aiprof" href="ai-studio.html"><i data-lucide="sparkles"></i><span class="t">AI-студія</span><i data-lucide="chevron-right"></i></a>'));
    }
    if (page === 'notifications.html') {
      var first = $('#list .nrow') || $('.nrow');
      if (first && !$('#nvid')) first.before(el('<div class="nrow new" id="nvid"><span class="ic"><i data-lucide="clapperboard"></i></span><div class="b"><div class="tt">Відео готове</div><div class="tx">Джинси Levi’s 501, W32 L32</div><a class="mini" href="studio.html?video=ready&amp;push=0">Переглянути</a><div class="tm">щойно</div></div></div>'));
    }
  })();
  /* ---- Відгуки, «Особу підтверджено» і «Підняти оголошення» (23 листопада 2026). Стилі — tools/trust.css,
          сторінки — promote.html, verify.html, опис — кінець docs/SCREENS.md. Відгук — лише після підтвердженої продажу:
          продавець позначає «Продано» й обирає покупця (основний шлях) або покупець сам натискає «Підтвердити покупку» ---- */
  (function () {
    var A = 'assets/';
    var stars = function (n) {
      var s = '<span class="tr-st" role="img" aria-label="' + String(n).replace('.', ',') + ' з 5">';
      for (var i = 1; i <= 5; i++) s += i <= n ? '<i data-lucide="star"></i>' : n > i - 1 ? '<span class="st-part"><i data-lucide="star" class="st-no"></i><span class="st-fill" style="width:' + Math.round((n - i + 1) * 100) + '%"><i data-lucide="star"></i></span></span>' : '<i data-lucide="star" class="st-no"></i>';
      return s + '</span>';
    };
    var say = function (t) {
      if (typeof window.toast === 'function') { window.toast(t); return; }
      var e = $('#toast'); if (!e) return; e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(function () { e.classList.remove('on'); }, 2400);
    };
    var openS = function (id) {
      if (!$('.scrim')) document.body.appendChild(el('<div class="scrim"></div>'));
      $$('.sheet').forEach(function (s) { s.style.display = s.id === id ? '' : 'none'; }); document.body.classList.add('sheet-on');
    };
    var closeS = function () { document.body.classList.remove('sheet-on'); $$('.sheet').forEach(function (s) { s.style.display = ''; }); };
    document.addEventListener('click', function (e) { if (e.target.closest('[data-trclose]') || e.target.classList.contains('scrim')) closeS(); });
    var REVIEWS = [
      ['А', 'Андрій', 5, '10 лист.', 'Туфлі як на фото, майже нові. Зустрілись вчасно.', 'shoes.jpg', 'Туфлі шкіряні, 42 розмір', 'Дякую, гарного носіння!'],
      ['І', 'Ірина', 4, '2 лист.', 'Футболка гарна, але принт трохи потертий — Олена чесно попередила.', 'tshirt.jpg', 'Футболка з принтом, розмір M', ''],
      ['О', 'Олег', 5, '28 жовт.', 'Швидко відповіла, усе чесно. Рекомендую.', 'it-sneakers.jpg', 'Кросівки білі, 38 розмір', ''],
      ['М', 'Марія', 5, '20 жовт.', 'Річ як на фото, домовились за пів години.', 'it-scarf.jpg', 'Шарф вовняний', '']
    ];

    /* лист «Оцініть продавця»: спершу порожні зірки, «Опублікувати» — лише після оцінки */
    var rateSheet = function (who, item, done) {
      if ($('#trrate')) return;
      var sh = el('<section class="sheet" id="trrate" role="dialog" aria-modal="true" aria-label="Оцініть продавця"><div class="sheet-head"><h2>Оцініть продавця</h2><button class="x" type="button" data-trclose aria-label="Закрити"><i data-lucide="x"></i></button></div>'
        + '<div class="sheet-body tr-rate"><div class="rt-who"><img src="' + A + 'avatar.jpg" alt=""><b>' + who + '</b><small>' + item + '</small></div>'
        + '<div class="tr-stars" role="radiogroup" aria-label="Оцінка">' + [1, 2, 3, 4, 5].map(function (n) { return '<button type="button" role="radio" aria-checked="false" aria-label="' + n + ' з 5" data-n="' + n + '"><i data-lucide="star"></i></button>'; }).join('') + '</div>'
        + '<div class="tr-chips"><button type="button" aria-pressed="false">Річ як на фото</button><button type="button" aria-pressed="false">Швидко відповідає</button><button type="button" aria-pressed="false">Вчасно на зустрічі</button></div>'
        + '<textarea rows="2" placeholder="Коментар (необов’язково)" aria-label="Коментар"></textarea>'
        + '<button class="btn primary wide" type="button" id="trpub" disabled>Опублікувати відгук</button></div></section>');
      document.body.appendChild(sh);
      var sb = $$('.tr-stars button', sh), pub = $('#trpub', sh);
      sb.forEach(function (b) {
        b.addEventListener('click', function () {
          var n = +b.dataset.n;
          sb.forEach(function (x, i) { x.classList.toggle('lit', i < n); x.setAttribute('aria-checked', String(i === n - 1)); });
          b.classList.add('tr-pop'); setTimeout(function () { b.classList.remove('tr-pop'); }, 260);
          pub.disabled = false;
        });
      });
      $$('.tr-chips button', sh).forEach(function (c) { c.addEventListener('click', function () { c.setAttribute('aria-pressed', String(c.getAttribute('aria-pressed') !== 'true')); }); });
      pub.addEventListener('click', function () { closeS(); say('Відгук опубліковано'); if (done) done(); });
      icons();
    };
    var reqCard = function (img, text, yes, no, okText, noText, onYes) {
      var c = el('<div class="tr-req" id="trreq"><div class="rq-top"><img src="' + A + img + '" alt=""><p>' + text + '</p></div>'
        + '<div class="rq-acts"><button class="btn primary" type="button" data-tr="yes">' + yes + '</button><button class="btn ghost" type="button" data-tr="no">' + no + '</button></div>'
        + '<p class="rq-res" hidden><i data-lucide="circle-check"></i><span></span></p></div>');
      c.addEventListener('click', function (e) {
        var b = e.target.closest('[data-tr]'); if (!b) return;
        var r = $('.rq-res', c);
        if (b.dataset.tr === 'yes') { c.classList.add('rq-done'); $('span', r).textContent = okText; r.hidden = false; if (onYes) setTimeout(onYes, 350); }
        else { $('.rq-acts', c).hidden = true; r.classList.add('no'); $('span', r).textContent = noText; r.hidden = false; }
      });
      return c;
    };

    /* розмова очима покупця: запит продавця (?sold=1) або запасна кнопка «Підтвердити покупку» */
    if (page === 'dialog.html' && q.get('as') !== 'seller' && q.get('new') !== '1') {
      var msgs = $('#msgs'), item = $('.dtop .ditem');
      var markDone = function () { var r = $('#trreq .rq-res span'); if (r) r.textContent = 'Покупку підтверджено · відгук опубліковано'; var sl = $('#trslot'); if (sl) sl.hidden = true; };
      rateSheet('Олена', 'Джинси Levi’s 501', markDone);
      if (q.get('sold') === '1' && msgs) {
        msgs.appendChild(el('<div class="msg in">Гарного носіння!<span class="mt num">18:24</span></div>'));
        msgs.appendChild(reqCard('jeans-1.jpg', 'Олена просить підтвердити покупку джинсів', 'Підтвердити покупку', 'Покупки не було', 'Покупку підтверджено', 'Ви відповіли, що покупки не було', function () { openS('trrate'); }));
        setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 50);
      } else if (item && !$('#trslot')) {
        item.after(el('<div class="tr-slot" id="trslot"><button class="btn" type="button" id="trbuy"><i data-lucide="circle-check"></i>Підтвердити покупку</button>'
          + '<div class="tr-wait" id="trwait" hidden><i data-lucide="clock"></i>Очікуємо підтвердження від Олени</div>'
          + '<button class="btn primary" type="button" id="trleave" hidden><i data-lucide="star"></i>Залишити відгук</button></div>'));
        $('#trbuy').addEventListener('click', function () {
          $('#trbuy').hidden = true; $('#trwait').hidden = false;
          setTimeout(function () { $('#trwait').hidden = true; $('#trleave').hidden = false; say('Олена підтвердила продаж'); }, 3000);   /* для показу: продавець відповідає за 3 с */
        });
        $('#trleave').addEventListener('click', function () { openS('trrate'); });
      }
    }
    /* розмова очима продавця: покупець просить підтвердити продаж (?as=seller&confirm=1) */
    if (page === 'dialog.html' && q.get('as') === 'seller' && q.get('confirm') === '1') {
      var sm = $('#msgs'), of = $('#offer');
      if (of) of.remove();
      if (sm) {
        sm.appendChild(el('<div class="msg out">Так, можу показати сьогодні<span class="mt num">12:10</span></div>'));
        sm.appendChild(el('<div class="msg in">Тоді о 18:00, домовились<span class="mt num">12:14</span></div>'));
        sm.appendChild(reqCard('bag.jpg', 'Максим просить підтвердити продаж сумки', 'Підтвердити продаж', 'Продажу не було', 'Продаж підтверджено. Максим може залишити відгук', 'Ви відповіли, що продажу не було'));
        var qk = $('#quick'); if (qk) qk.hidden = true;
        setTimeout(function () { window.scrollTo(0, document.body.scrollHeight); }, 50);
      }
    }

    /* оголошення: оцінка й перевірена особа в блоці продавця; своє оголошення — «Підняти» */
    if (page === 'product.html') {
      $$('.seller .vbadge').forEach(function (v) { v.remove(); });
      var who = $('.seller .who');
      if (who && q.get('own') !== '1') {
        var isNew = q.get('seller') === 'new';
        who.innerHTML = '<span class="name">Олена</span>'
          + (isNew ? '<span class="sub tr-rt">Поки немає відгуків</span>' : '<span class="sub tr-rt tr-rt-star"><i data-lucide="star"></i><b>4,8</b> · 12 відгуків</span>')
          + '<span class="sub tr-rt tr-rt-vf"><i data-lucide="badge-check"></i>Особу підтверджено</span>'
          + '<span class="sub tr-rt"><i data-lucide="clock"></i>Відповідає протягом години</span>';
        var sc = $('.seller'); if (sc && !isNew && !$('.tr-quote')) sc.after(el('<a class="tr-quote" href="seller.html?tab=reviews">«' + REVIEWS[0][4] + '»<small>' + REVIEWS[0][1] + ' · 10 листопада</small></a>'));
      }
      var ob = $('#ownbar'), om = $('#omore');
      if (ob && om && !$('.pr-own')) om.before(el('<a class="pr-own" href="promote.html?item=jeans"><i data-lucide="arrow-up"></i>Підняти</a>'));
    }

    /* сторінка продавця: «Особу підтверджено», оцінка, вкладки «Оголошення / Відгуки» */
    if (page === 'seller.html') {
      var vb = $('.phead .vbadge'), pnm = $('.phead .nm'), isNewS = q.get('new') === '1';
      if (vb) vb.remove();
      if (pnm && !$('.tr-vchip')) pnm.after(el('<span class="tr-vchip"><i data-lucide="badge-check"></i>Особу підтверджено</span>'));
      $$('.phead .facts span').forEach(function (s) { if (/продано/.test(s.textContent)) s.lastChild.textContent = isNewS ? '0 продано' : '8 продано'; });
      var ph = $('.phead'), hd = $('main .head'), grid = $('main .grid');
      if (ph && hd && grid && !$('.tr-tabs')) {
        if (isNewS) ph.after(el('<div class="tr-score"><span class="tr-new" style="margin:0">Поки немає відгуків</span></div>'));
        else ph.after(el('<div class="tr-score"><span class="sc-n">4,8</span><span>' + stars(4.8) + '<small>12 відгуків</small></span></div>'));
        var tabs = el('<div class="tr-tabs" role="tablist"><button type="button" role="tab" aria-selected="true" data-trtab="ads">Оголошення 4</button>' + (isNewS ? '' : '<button type="button" role="tab" aria-selected="false" data-trtab="rv">Відгуки 12</button>') + '</div>');
        hd.replaceWith(tabs);
        var list = el('<section class="tr-list" id="trlist" hidden aria-label="Відгуки">' + REVIEWS.map(function (r) {
          return '<article class="tr-rv"><div class="rv-h"><span class="ava sm"><span class="ltr">' + r[0] + '</span></span><div><b>' + r[1] + '</b>' + stars(r[2]) + '</div><time>' + r[3] + '</time></div><p>' + r[4] + '</p>'
            + '<div class="rv-it"><img src="' + A + r[5] + '" alt="">' + r[6] + '</div>' + (r[7] ? '<div class="rv-re"><b>Відповідь Олени</b>' + r[7] + '</div>' : '') + '</article>';
        }).join('') + '</section>');
        grid.after(list);
        var showTab = function (t) {
          $$('[data-trtab]', tabs).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.trtab === t)); });
          grid.hidden = t !== 'ads'; var mb = $('main .morebox'); if (mb) mb.hidden = t !== 'ads'; list.hidden = t !== 'rv';
        };
        tabs.addEventListener('click', function (e) { var b = e.target.closest('[data-trtab]'); if (b) showTab(b.dataset.trtab); });
        if (q.get('tab') === 'reviews' && !isNewS) showTab('rv');
      }
    }

    /* профіль: відгуки про мене й перевірка особи */
    if (page === 'profile.html') {
      var g = $('main .group');
      if (g && !$('#trprof')) {
        g.appendChild(el('<a class="lrow" id="trprof" href="seller.html?tab=reviews"><i data-lucide="star"></i><span class="t">Відгуки про мене</span><span class="v num">4,8 · 12</span><i data-lucide="chevron-right"></i></a>'));
        g.appendChild(q.get('verified') === '1'
          ? el('<a class="lrow" id="trverify" href="seller.html"><i data-lucide="badge-check"></i><span class="t">Особу підтверджено</span><i data-lucide="chevron-right"></i></a>')
          : el('<a class="lrow" id="trverify" href="verify.html"><i data-lucide="badge-check"></i><span class="t">Підтвердити особу</span><i data-lucide="chevron-right"></i></a>'));
      }
    }

    /* сповіщення: запит підтвердити покупку, запит підтвердити продаж, пропозиція підняти */
    if (page === 'notifications.html') {
      var lst = $('#list');
      if (lst && !$('#nbuy')) {
        var nbuy = el('<div class="nrow new" id="nbuy"><span class="ic"><i data-lucide="circle-check"></i></span><div class="b"><div class="tt">Олена просить підтвердити покупку</div><div class="tx">Джинси Levi’s 501, W32 L32. Після підтвердження можна залишити відгук.</div><a class="mini" href="dialog.html?sold=1">Підтвердити покупку</a><div class="tm">щойно</div></div></div>');
        lst.insertBefore(nbuy, lst.firstChild);
        nbuy.after(el('<div class="nrow new" id="nconf"><span class="ic"><i data-lucide="handshake"></i></span><div class="b"><div class="tt">Максим просить підтвердити продаж</div><div class="tx">Сумка шкіряна, коричнева</div><a class="mini" href="dialog.html?as=seller&amp;confirm=1">Відкрити розмову</a><div class="tm">13:10</div></div></div>'));
        var exp = $$('.nrow', lst).filter(function (r) { return /завершується/.test(r.textContent); })[0];
        var nup = el('<div class="nrow" id="nup"><span class="ic"><i data-lucide="arrow-up"></i></span><div class="b"><div class="tt">Підніміть оголошення про джинси</div><div class="tx">Оголошення стане першим у категорії «Жіночий одяг» за сортуванням «Спочатку нові».</div><a class="mini hot" href="promote.html?item=jeans">Підняти за 39 грн</a><div class="tm">вчора</div></div></div>');
        if (exp) exp.before(nup); else lst.appendChild(nup);
      }
    }

    /* «Мої оголошення»: «Підняти за 39 грн» у діях з оголошенням; після оплати — стан у рядку (?up=jeans|hoodie|bag) */
    if (page === 'my.html') {
      var KEY = function (r) { var n = $('.nm', r); n = n ? n.textContent : ''; return /Levi/.test(n) ? 'jeans' : /Сумка/.test(n) ? 'bag' : /Худі/.test(n) ? 'hoodie' : ''; };
      var acts = $('#acts .alist');
      if (acts && !$('#prrow')) {
        var pr = el('<a class="lrow" id="prrow" href="promote.html?item=jeans"><i data-lucide="arrow-up"></i><span class="t">Підняти за 39 грн</span></a>');
        acts.insertBefore(pr, acts.firstChild);
        var ai = el('<a class="lrow" id="airow" href="studio.html?item=jeans"><i data-lucide="sparkles"></i><span class="t">Відкрити в AI-студії</span></a>');
        pr.after(ai);
        $$('.mrow .more').forEach(function (b) {
          b.addEventListener('click', function () {
            var r = b.closest('.mrow'), act = !!r.closest('[data-panel="active"]'), key = KEY(r);
            pr.hidden = ai.hidden = !act || !key; pr.style.display = ai.style.display = pr.hidden ? 'none' : '';
            if (key) { pr.setAttribute('href', 'promote.html?item=' + key); ai.setAttribute('href', 'studio.html?item=' + key); }
          }, true);
        });
      }
      var up = q.get('up');
      if (up) {
        var ur = $$('[data-panel="active"] .mrow').filter(function (r) { return KEY(r) === up; })[0];
        var note = ur && $('.note', ur);
        if (note) { note.className = 'note pr-up'; note.innerHTML = '<i data-lucide="circle-check"></i>Піднято о 14:32 · <a href="catalog.html?up=' + up + '">Переглянути в каталозі</a>'; }
      }
    }

    /* каталог: підняте оголошення стає першим (?up=jeans|hoodie) */
    if (page === 'catalog.html' && q.get('up')) {
      var RE = { jeans: /Levi/, hoodie: /Худі сіре/ }[q.get('up')];
      var cg = $('#grid') || $('main .grid');
      var cards = cg ? $$('.card', cg) : [];
      var mine = RE && cards.filter(function (c) { return RE.test(c.textContent); })[0];
      if (mine) {
        if (cards.indexOf(mine) < 4 && cards[4]) cards[4].after(mine);      /* до підняття — нижче в стрічці */
        var tw = document.createTreeWalker(mine, NodeFilter.SHOW_TEXT), tn;   /* час у картці — час підняття */
        while ((tn = tw.nextNode())) if (/·\s*(сьогодні|вчора)/.test(tn.nodeValue)) tn.nodeValue = tn.nodeValue.replace(/·.*$/, '· 14:32');
        setTimeout(function () {
          var all = $$('.card', cg), first = all.map(function (c) { return c.getBoundingClientRect(); });
          cg.insertBefore(mine, cg.firstChild);
          if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !mine.animate) return;
          all.forEach(function (c, i) {
            var l = c.getBoundingClientRect(), dx = first[i].left - l.left, dy = first[i].top - l.top;
            if (!dx && !dy) return;
            var me = c === mine;
            c.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'translate(' + dx / 2 + 'px,' + dy / 2 + 'px)' + (me ? ' scale(1.04)' : ''), offset: 0.5 }, { transform: 'none' }],
              { duration: me ? 900 : 700, delay: me ? 0 : 60, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
          });
        }, 900);
      }
    }
  })();
  icons();
})();
