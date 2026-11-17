/* Навігація й полки вітрини (17 листопада 2026, після незалежної оцінки макета):
   меню профілю й рядок розділів у шапці, плитки категорій і полка «З відео» на головній, шлях, швидкі фільтри,
   мініатюри й лічильник у галереї, «Схожі оголошення». Підключає build_shop.py; розмітку сторінок не переписує,
   а доповнює під час відкриття, тому всі попередні кнопки й стани працюють як раніше. */
(function () {
  var q = new URLSearchParams(location.search), page = location.pathname.split('/').pop() || 'home.html';
  var wide = window.matchMedia('(min-width: 900px)');
  var CATS = [
    ['Жіночий одяг', 'women', 'cat-women.jpg', ['Куртки й пальта', 'Джинси', 'Худі та світшоти', 'Футболки', 'Сукні']],
    ['Чоловічий одяг', 'men', 'cat-men.jpg', ['Куртки й пальта', 'Джинси', 'Худі та світшоти', 'Футболки']],
    ['Взуття', 'shoes', 'cat-shoes.jpg', ['Кросівки', 'Черевики', 'Туфлі']],
    ['Смартфони', 'phones', 'cat-phones.jpg', ['Apple', 'Samsung', 'Xiaomi', 'Google']]
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
    var nav = el('<nav class="catnav" aria-label="Розділи">' + CATS.map(function (c) {
      return '<div class="ci"><button class="cb" type="button" aria-haspopup="true" aria-expanded="false">' + c[0] + '<i data-lucide="chevron-down"></i></button><div class="drop" role="menu"><a class="all" href="catalog.html?cat=' + c[1] + '">Усе в розділі</a>'
        + c[3].map(function (s) { return '<a href="catalog.html?cat=' + c[1] + '&sub=' + encodeURIComponent(s) + '">' + s + '</a>'; }).join('') + '</div></div>';
    }).join('') + '</nav>');
    top.after(nav);
    $$('.ci', nav).forEach(function (h) { holder(h, true); });
  }

  /* ---------- вхід: шлях назад до оголошень; кабінет: швидке редагування ---------- */
  if (page === 'login.html') document.body.appendChild(el('<a class="toshop" href="home.html"><i data-lucide="arrow-left"></i>До оголошень</a>'));
  if (page === 'my.html') $$('[data-panel="active"] .mrow').forEach(function (r) { var m = $('.more', r); if (m && !$('.edit', r)) m.before(el('<a class="edit" href="create.html?step=2" aria-label="Редагувати"><i data-lucide="pencil"></i></a>')); });

  /* ---------- пошук: явна дія «Шукати …» і область пошуку в підказках ---------- */
  if (page === 'search.html') {
    var sq = $('#q'), sugg = $('#sugg');
    if (sq && sugg) {
      var goRow = el('<a class="lrow go" href="catalog.html"><i data-lucide="search"></i><span class="t">Шукати «<b></b>»<small>У всіх категоріях</small></span><i data-lucide="arrow-right"></i></a>');
      sugg.insertBefore(goRow, sugg.firstChild);
      var setGo = function () { var v = sq.value.trim(); $('b', goRow).textContent = v; goRow.setAttribute('href', 'catalog.html?q=' + encodeURIComponent(v)); goRow.hidden = !v; };
      sq.addEventListener('input', setGo); setGo();
      $$('.lrow:not(.go) .t', sugg).forEach(function (t) { if (!$('small', t)) t.appendChild(el('<small>У всіх категоріях</small>')); });
    }
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
    var sg = $('main .grid'); if (sg) { sg.classList.add('hasmore'); sg.after(el('<div class="morebox"><a class="btn ghost" href="home.html">Усі оголошення TRAD</a></div>')); }
  }
  if (page === 'favorites.html') {
    var fg = $('main .grid');
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
  if (page === 'notifications.html') { var nbar = $('.bar'), ra = $('#readall'); if (nbar && ra) ra.before(el('<a class="act" href="notify.html" aria-label="Налаштування сповіщень"><i data-lucide="settings"></i></a>')); }

  /* ---------- головна ---------- */
  if (page === 'home.html') {
    document.body.classList.add('home');
    var chips = $('nav.chips'); if (chips) chips.remove();
    var main = $('main'), head = $('.head', main), grid = $('.grid', main);
    top.after(el('<a class="cityrow" href="city.html"><i data-lucide="map-pin"></i><span>Вся Україна</span><i data-lucide="chevron-right"></i></a>'));
    main.insertBefore(el('<section class="cats" aria-label="Категорії">' + CATS.map(function (c) {
      return '<a class="cat-tile" href="catalog.html?cat=' + c[1] + '"><img src="assets/' + c[2] + '" alt=""><span>' + c[0] + '</span></a>';
    }).join('') + '</section>'), head);
    var shelf = el('<section class="shelf" aria-label="Оголошення з відео"><div class="head"><h2>З відео</h2><a class="morelink" href="catalog.html?video=1">Показати всі<i data-lucide="chevron-right"></i></a></div><p class="shelfnote">На відео видно стан, колір і розмір, а не лише вдалий кадр</p><div class="row"></div></section>');
    $('.row', shelf).appendChild(el('<a class="vpromo" href="catalog.html?video=1"><span class="pl"><i data-lucide="play"></i></span><b>Товар у русі</b><span>На відео видно стан, колір і розмір, а не лише вдалий кадр</span></a>'));
    $$('.card', grid).filter(function (c) { return $('.dur', c); }).forEach(function (c) { $('.row', shelf).appendChild(c.cloneNode(true)); });
    main.insertBefore(shelf, head);
    shelf.addEventListener('click', function (e) {
      var f = e.target.closest('.fav'); if (!f) return;
      e.preventDefault(); var on = f.getAttribute('aria-pressed') === 'true';
      f.setAttribute('aria-pressed', String(!on)); f.setAttribute('aria-label', on ? 'Додати в обране' : 'Прибрати з обраного');
    });
    var pill = $('.pill', head), box = el('<div class="headr"><select class="sortsel" id="hsort" aria-label="Сортування"><option value="new">Спочатку нові</option><option value="cheap">Спочатку дешевші</option><option value="dear">Спочатку дорожчі</option></select></div>');
    head.classList.add('wraps'); head.appendChild(box); box.appendChild(pill);
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
      var quick = el('<div class="qflt" aria-label="Швидкі фільтри"><button class="qchip" type="button" data-q="video" aria-pressed="false"><i data-lucide="play"></i>Тільки з відео</button>'
        + '<button class="qchip" type="button" data-q="size">Розмір<i data-lucide="chevron-down"></i></button><button class="qchip" type="button" data-q="1" aria-pressed="false">Нове</button><button class="qchip" type="button" data-q="2" aria-pressed="false">Вживане</button>'
        + '<button class="qchip" type="button" data-q="price">Ціна<i data-lucide="chevron-down"></i></button></div>');
      tools.after(quick);
      var panel = function () { return wide.matches && side ? side : sheet; };
      var sync = function () {
        var p = panel(), cond = $$('.opts[data-single] .opt', p), sw = $('.sw', p);
        $$('.qchip', quick).forEach(function (b) {
          var k = b.dataset.q;
          if (k === 'video') b.setAttribute('aria-pressed', String(!!sw && sw.getAttribute('aria-checked') === 'true'));
          else if (k === 'size') { var ss = $$('.opts:not([data-single]) .opt[aria-pressed="true"]', p).map(function (x) { return x.textContent; }); b.firstChild.textContent = ss.length ? 'Розмір ' + ss.join(', ') : 'Розмір'; b.classList.toggle('set', !!ss.length); }
          else if (k !== 'price') b.setAttribute('aria-pressed', String(!!cond[+k] && cond[+k].getAttribute('aria-pressed') === 'true'));
        });
      };
      quick.addEventListener('click', function (e) {
        var b = e.target.closest('.qchip'); if (!b) return;
        var k = b.dataset.q, p = panel(), cond = $$('.opts[data-single] .opt', p);
        if (k === 'price' || k === 'size') { e.stopPropagation(); if (!(wide.matches && document.body.classList.contains('fopen'))) $('#openf').click(); var inp = $('[aria-label="Ціна до"]', p); if (inp && k === 'price') setTimeout(function () { inp.focus(); }, 350); return; }
        if (k === 'video') $('.sw', p).click();
        else (cond[+k].getAttribute('aria-pressed') === 'true' ? cond[0] : cond[+k]).click();
        if (p === sheet) apply.click();
      });
      document.addEventListener('click', function () { setTimeout(sync, 60); });
      var cgrid = $('#grid'), cards0 = $$('.card', cgrid), cmore = el('<div class="morebox"><p class="endnote" id="shown"></p><button class="btn ghost" type="button" id="more">Показати ще</button></div>'), extra = 0;
      var shownText = function () { var t = parseInt($('#n').textContent, 10) || 0, s = Math.min(t, $$('.card', cgrid).length); $('#shown').textContent = 'Показано ' + s + ' зі ' + t; $('#more').hidden = s >= t || extra >= 2; };
      cgrid.classList.add('hasmore'); cgrid.after(cmore);
      $('#more').addEventListener('click', function (e) { e.stopPropagation(); cards0.forEach(function (c) { cgrid.appendChild(c.cloneNode(true)); }); extra++; shownText(); });
      document.addEventListener('click', function () { setTimeout(shownText, 90); }); setTimeout(shownText, 120);
      var hometab = $('nav.tabs .tab'); if (hometab) hometab.setAttribute('aria-current', 'page');
      if (q.get('video') === '1') setTimeout(function () { $('[data-q="video"]', quick).click(); }, 0);
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
    var sblk = $('.seller', pmain) ? $('.seller', pmain).closest('.block') : null;
    if (sblk && q.get('own') !== '1') sblk.appendChild(el('<p class="safeline"><i data-lucide="shield-alert"></i><span>TRAD не приймає оплату й не доставляє товар. Огляньте річ перед оплатою. <a href="rules.html">Правила безпеки</a></span></p>'));
    var foot = $('.foot', pmain);
    if (foot && q.get('own') !== '1') {
      var SIM = [['jeans-light.jpg', '750&nbsp;грн', 'Джинси мом, W30 L30', '0:20'], ['jeans-black.jpg', '1&nbsp;100&nbsp;грн', 'Джинси чорні слім, W32 L34', '0:15'], ['jeans-grey.jpg', '600&nbsp;грн', 'Джинси сірі прямі, W31 L32', ''], ['jeans-2.jpg', '1&nbsp;200&nbsp;грн', 'Джинси прямі, W28 L30', '0:22'], ['jeans-3.jpg', '700&nbsp;грн', 'Джинси сині, W30 L32', '']];
      foot.before(el('<section class="block"><h2>Схожі оголошення</h2><div class="more" id="similar">' + SIM.map(function (s) {
        return '<a class="card" href="product.html"><div class="frame"><img src="assets/' + s[0] + '" alt=""><span class="segs" aria-hidden="true"><i class="' + (s[3] ? 'video' : 'on') + '"></i><i></i><i></i></span>'
          + (s[3] ? '<span class="dur"><i data-lucide="play"></i>' + s[3] + '</span>' : '') + '<div class="cap"><div class="price num">' + s[1] + '</div><div class="title">' + s[2] + '</div></div></div></a>';
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
  /* ---------- картки з відео: однаковий значок тривалості ---------- */
  $$('.card .frame').forEach(function (f, i) {
    if ($('.segs i.video', f) && !$('.dur', f)) $('.segs', f).after(el('<span class="dur"><i data-lucide="play"></i>0:' + (18 + (i * 7) % 20) + '</span>'));
  });
  /* ---------- картки в стрічках: рядок «стан · розмір» під назвою ---------- */
  $$('.card .title').forEach(function (t) {
    if ($('.attrs', t.parentNode)) return;
    var s = t.textContent, m = s.match(/,?\s*(?:розмір\s+([\w.]+)|(\d{2})\s+розмір|(W\d+\s?L\d+)|(\d+\s?ГБ))/i), size = m ? (m[1] || m[2] || m[3] || m[4]) : '';
    var cond = /принтом/i.test(s) ? 'Нове' : 'Вживане';
    if (m) t.textContent = s.replace(m[0], '').replace(/,\s*$/, '').trim();
    t.after(el('<div class="attrs">' + cond + (size ? ' · ' + size : '') + '</div>'));
  });
  icons();
})();
