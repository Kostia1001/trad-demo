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
    ['Смартфони', 'phones', 'cat-phones.jpg', ['Apple', 'Samsung', 'Xiaomi', 'Google'], 'Смартфони']
  ];
  function icons() { if (window.lucide) lucide.createIcons(); }
  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
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
    var prof = $('[aria-label="Профіль"]', desk);
    if (q.get('guest') === '1') {
      $$('.icon-btn', desk).forEach(function (b) { b.remove(); });
      desk.insertBefore(el('<a class="loginbtn" href="login.html?next=' + page + '">Увійти</a>'), desk.firstChild);
    } else if (prof) {
      var me = el('<div class="pmenu" id="me"><button class="mebtn" type="button" aria-haspopup="true" aria-expanded="false" aria-label="Меню профілю"><img src="assets/avatar.jpg" alt="">Олена<i data-lucide="chevron-down"></i></button>'
        + '<div class="drop" role="menu"><a class="who" href="profile.html"><img src="assets/avatar.jpg" alt=""><span><b>Олена</b><small>+380 67 123 45 67 · Одеса</small></span></a>'
        + '<a href="my.html"><i data-lucide="layout-list"></i>Мої оголошення<small>3 активні</small></a>'
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
      }).join('') + '</div></div>' + CATS.map(function (c) {
      return '<div class="ci"><button class="cb" type="button" aria-haspopup="true" aria-expanded="false">' + c[0] + '<i data-lucide="chevron-down"></i></button><div class="drop" role="menu"><a class="all" href="catalog.html?cat=' + c[1] + '">Усе в розділі</a>'
        + c[3].map(function (s) { return '<a href="catalog.html?cat=' + c[1] + '&sub=' + encodeURIComponent(s) + '">' + s + '</a>'; }).join('') + '</div></div>';
    }).join('') + '</nav>');
    top.after(nav);
    $$('.ci, .ca', nav).forEach(function (h) { holder(h, true); });
  }

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
    document.addEventListener('click', function () { setTimeout(ctitle, 0); });
    ctitle();
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
  if (page === 'my.html') $$('[data-panel="active"] .mrow').forEach(function (r) { var m = $('.more', r); if (m && !$('.edit', r)) m.before(el('<a class="edit" href="create.html?step=2" aria-label="Редагувати"><i data-lucide="pencil"></i></a>')); });

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
    /* телефон: розділи — картинки з підписом одразу під шапкою (як у OLX і Kleinanzeigen), остання плитка — «Усі категорії».
       Поки розділів чотири, усі видно без гортання; на комп'ютері розділи показує рядок у шапці */
    main.insertBefore(el('<nav class="cats" aria-label="Розділи">' + CATS.map(function (c) {
      return '<a href="catalog.html?cat=' + c[1] + '"><span class="ph"><img src="assets/' + c[2] + '" alt=""></span>' + c[0] + '</a>';
    }).join('') + '<a class="allcat" href="category.html?browse=1"><span class="ph"><i data-lucide="layout-grid"></i></span>Усі категорії</a></nav>'), head);
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
    if (h1) h1.before(el('<nav class="crumbs" aria-label="Шлях"><a href="home.html">Головна</a><i data-lucide="chevron-right"></i><span>' + h1.textContent + '</span></nav>'));
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
      sblock.classList.add('folded');
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
  function cardfix(c) {
    if (c.classList.contains('cv') || c.classList.contains('skel') || c.closest('.authwall')) return;
    var f = $('.frame', c), cap = $('.cap', c); if (!f || !cap) return;
    var d = $('.dur', f), segs = $('.segs', f), fav = $('.fav', f), meta = $('.meta', c), at = $('.attrs', cap), title = $('.title', cap);
    if (d) d.remove(); if (segs) segs.remove();
    if (meta) {                                   /* «Київ · сьогодні, 14:20» → «Київ · сьогодні»: година в стрічці зайва */
      meta.textContent = meta.textContent.split('·').map(function (x) { return x.trim().replace(/,\s*\d{1,2}:\d{2}$/, ''); }).join(' · ');
      cap.appendChild(meta);
    }
    if (fav) cap.insertBefore(fav, title);
    f.after(cap);
    f.appendChild(el('<span class="vmark" aria-hidden="true"><i data-lucide="play"></i></span>'));
    c.classList.add('cv');
  }
  $$('.card').forEach(cardfix);
  /* доступні оголошення — першими: заброньовані й продані не мають стояти на початку стрічки */
  $$('#grid, main .grid').forEach(function (g) { $$('.card', g).filter(function (c) { return $('.state', c); }).forEach(function (c) { g.appendChild(c); }); });
  /* наступні оголошення підвантажуються самі, коли людина догортала; кнопка «Показати ще» лишається запасною */
  var moreBtn = $('#more');
  if (moreBtn && 'IntersectionObserver' in window) new IntersectionObserver(function (es) { if (es[0].isIntersecting && !moreBtn.hidden) moreBtn.click(); }, { rootMargin: '0px 0px 500px 0px' }).observe(moreBtn);
  /* ---------- нижнє меню на телефоні: їде разом зі сторінкою, а не «стрибає» ----------
     Гортаємо вниз — меню з'їжджає за край рівно настільки, наскільки прогорнули; гортаємо вгору — так само повертається.
     Зупинилися — плавно стає на місце (так поводиться меню на сайті OLX). Якщо людина просила менше руху, меню не рухається. */
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
      navOff = Math.min(Math.max(navOff + dy, 0), tabsNav.offsetHeight + 16);
      if (!navRaf) navRaf = requestAnimationFrame(navPaint);
      clearTimeout(navEnd);
      navEnd = setTimeout(function () { tabsNav.classList.remove('moving'); navOff = 0; navPaint(); }, 380);
    }, { passive: true });
  }
  icons();
})();
