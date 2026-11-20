(function () {
  'use strict';

  var cfg = window.XT_CONFIG || {};
  var number = String(cfg.whatsapp || '').replace(/\D/g, '');

  function waUrl(text) {
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
  }

  // Enlaces de WhatsApp: toman el número de config.js
  document.querySelectorAll('.js-wa').forEach(function (a) {
    var msg = a.getAttribute('data-msg') || 'Hola XT Negocio, quiero información.';
    a.href = waUrl(msg);
    a.target = '_blank';
    a.rel = 'noopener';
  });
  document.querySelectorAll('.js-wa-label').forEach(function (el) {
    if (cfg.whatsappLabel) el.textContent = cfg.whatsappLabel;
  });

  // Menú en celular
  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('menu');
  if (toggle && menu) {
    var close = function () {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú');
    };
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    });
    menu.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', close); });
  }

  // "Me interesa" (una sola opción)
  var chips = Array.prototype.slice.call(document.querySelectorAll('.chip'));
  function pick(chip, focus) {
    chips.forEach(function (c) {
      var on = c === chip;
      c.setAttribute('aria-checked', String(on));
      c.tabIndex = on ? 0 : -1;
    });
    if (focus) chip.focus();
  }
  chips.forEach(function (chip, i) {
    chip.tabIndex = chip.getAttribute('aria-checked') === 'true' ? 0 : -1;
    chip.addEventListener('click', function () { pick(chip, false); });
    chip.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); pick(chips[(i + 1) % chips.length], true); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); pick(chips[(i - 1 + chips.length) % chips.length], true); }
    });
  });

  // Formulario: valida y abre WhatsApp
  var form = document.getElementById('lead-form');
  if (form) {
    var fields = document.getElementById('form-fields');
    var success = document.getElementById('form-success');
    var error = document.getElementById('form-error');
    var retry = document.getElementById('wa-retry');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = form.nombre.value.trim();
      var tel = form.whatsapp.value.replace(/\D/g, '');
      var okNombre = nombre.length >= 2;
      var okTel = tel.length >= 10;
      form.nombre.setAttribute('aria-invalid', String(!okNombre));
      form.whatsapp.setAttribute('aria-invalid', String(!okTel));
      if (!(okNombre && okTel)) {
        error.hidden = false;
        (okNombre ? form.whatsapp : form.nombre).focus();
        return;
      }
      error.hidden = true;

      var interes = (chips.filter(function (c) { return c.getAttribute('aria-checked') === 'true'; })[0] || {}).textContent || 'Información';
      var correo = form.correo.value.trim();
      var mensaje = form.mensaje.value.trim();
      var text = 'Hola XT Negocio, quiero una asesoría.\n' +
        'Me interesa: ' + interes.trim() + '\n' +
        'Nombre: ' + nombre + '\n' +
        'WhatsApp: ' + tel +
        (correo ? '\nCorreo: ' + correo : '') +
        (mensaje ? '\nObjetivo: ' + mensaje : '');
      var url = waUrl(text);
      if (retry) retry.href = url;

      fields.hidden = true;
      success.hidden = false;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Formulario de empresas (empresas.html): valida y abre WhatsApp
  var biz = document.getElementById('biz-form');
  if (biz) {
    var bizFields = document.getElementById('biz-fields');
    var bizSuccess = document.getElementById('biz-success');
    var bizError = document.getElementById('biz-error');
    var bizRetry = document.getElementById('biz-retry');

    biz.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = biz.nombre.value.trim();
      var empresa = biz.empresa.value.trim();
      var personas = parseInt(biz.personas.value, 10);
      var okNombre = nombre.length >= 2;
      var okEmpresa = empresa.length >= 2;
      var okPersonas = personas >= 1;
      biz.nombre.setAttribute('aria-invalid', String(!okNombre));
      biz.empresa.setAttribute('aria-invalid', String(!okEmpresa));
      biz.personas.setAttribute('aria-invalid', String(!okPersonas));
      if (!(okNombre && okEmpresa && okPersonas)) {
        bizError.hidden = false;
        (!okNombre ? biz.nombre : !okEmpresa ? biz.empresa : biz.personas).focus();
        return;
      }
      bizError.hidden = true;

      var area = biz.area.value;
      var mensaje = biz.mensaje.value.trim();
      var text = 'Hola XT Negocio, quiero una propuesta de capacitación y certificación para mi empresa.\n' +
        'Nombre: ' + nombre + '\n' +
        'Empresa: ' + empresa + '\n' +
        'Número de personas: ' + personas +
        (area ? '\nÁrea de interés: ' + area : '') +
        (mensaje ? '\nComentarios: ' + mensaje : '');
      var url = waUrl(text);
      if (bizRetry) bizRetry.href = url;

      bizFields.hidden = true;
      bizSuccess.hidden = false;
      window.open(url, '_blank', 'noopener');
    });
  }

  // Formulario de inclusión digital (inclusion-digital.html): valida y abre WhatsApp
  var inc = document.getElementById('inc-form');
  if (inc) {
    var incFields = document.getElementById('inc-fields');
    var incSuccess = document.getElementById('inc-success');
    var incError = document.getElementById('inc-error');
    var incRetry = document.getElementById('inc-retry');
    var famField = document.getElementById('inc-familiar-field');
    var paraRadios = inc.querySelectorAll('input[name="para"]');
    var paraValue = function () {
      var v = 'Para mí';
      paraRadios.forEach(function (r) { if (r.checked) v = r.value; });
      return v;
    };
    paraRadios.forEach(function (r) {
      r.addEventListener('change', function () {
        if (famField) famField.hidden = paraValue() !== 'Para un familiar';
      });
    });

    inc.addEventListener('submit', function (e) {
      e.preventDefault();
      var nombre = inc.nombre.value.trim();
      var tel = inc.whatsapp.value.replace(/\D/g, '');
      var okNombre = nombre.length >= 2;
      var okTel = tel.length >= 10;
      inc.nombre.setAttribute('aria-invalid', String(!okNombre));
      inc.whatsapp.setAttribute('aria-invalid', String(!okTel));
      if (!(okNombre && okTel)) {
        incError.hidden = false;
        (okNombre ? inc.whatsapp : inc.nombre).focus();
        return;
      }
      incError.hidden = true;

      var para = paraValue();
      var familiar = inc.familiar.value.trim();
      var temas = [];
      inc.querySelectorAll('input[name="tema"]:checked').forEach(function (c) { temas.push(c.value); });
      var mensaje = inc.mensaje.value.trim();
      var text = (para === 'Para un familiar'
          ? 'Hola XT Negocio, quiero información del programa de Inclusión Digital para un familiar.'
          : 'Hola XT Negocio, quiero información del programa de Inclusión Digital.') + '\n' +
        'Nombre: ' + nombre + '\n' +
        'WhatsApp: ' + tel +
        (para === 'Para un familiar' && familiar ? '\nFamiliar: ' + familiar : '') +
        (temas.length ? '\nTemas de interés: ' + temas.join(', ') : '') +
        (mensaje ? '\nComentarios: ' + mensaje : '');
      var url = waUrl(text);
      if (incRetry) incRetry.href = url;

      incFields.hidden = true;
      incSuccess.hidden = false;
      window.open(url, '_blank', 'noopener');
    });
  }

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();

// Testimonios: visor de fotos y un solo video a la vez (testimonios.html)
(function () {
  'use strict';
  var box = document.getElementById('lightbox');
  var btns = Array.prototype.slice.call(document.querySelectorAll('.gallery-btn'));
  if (box && btns.length && typeof box.showModal === 'function') {
    var img = document.getElementById('lightbox-img');
    var cap = document.getElementById('lightbox-cap');
    var current = 0;
    var show = function (i) {
      current = (i + btns.length) % btns.length;
      var b = btns[current];
      var thumb = b.querySelector('img');
      img.src = b.getAttribute('data-full');
      img.alt = thumb ? thumb.alt : '';
      cap.textContent = b.getAttribute('data-caption') + ' (' + (current + 1) + ' de ' + btns.length + ')';
    };
    btns.forEach(function (b, i) {
      b.addEventListener('click', function () { show(i); box.showModal(); });
    });
    box.querySelector('.lightbox-close').addEventListener('click', function () { box.close(); });
    box.querySelector('.lightbox-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lightbox-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) box.close(); });
    box.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); show(current - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); show(current + 1); }
    });
    box.addEventListener('close', function () { img.removeAttribute('src'); btns[current].focus(); });
  } else {
    // Navegadores sin <dialog>: abrir la foto grande en otra pestaña
    btns.forEach(function (b) {
      b.addEventListener('click', function () { window.open(b.getAttribute('data-full'), '_blank', 'noopener'); });
    });
  }

  var videos = Array.prototype.slice.call(document.querySelectorAll('.video-item video'));
  videos.forEach(function (v) {
    v.addEventListener('play', function () {
      videos.forEach(function (o) { if (o !== v) o.pause(); });
    });
  });
})();

// Si el menú no cabe en una línea, se colapsa en el botón de menú
(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  var inner = header && header.querySelector('.header-inner');
  var menu = document.getElementById('menu');
  var toggle = document.querySelector('.menu-toggle');
  if (!header || !inner || !menu) return;
  function fitNav() {
    header.classList.remove('nav-collapsed');
    if (getComputedStyle(menu).position === 'absolute') return;
    var over = inner.scrollWidth > inner.clientWidth + 1 || menu.scrollWidth > menu.clientWidth + 1;
    if (over) {
      header.classList.add('nav-collapsed');
    } else if (menu.classList.contains('is-open')) {
      menu.classList.remove('is-open');
      if (toggle) { toggle.setAttribute('aria-expanded', 'false'); toggle.setAttribute('aria-label', 'Abrir menú'); }
    }
  }
  var timer;
  window.addEventListener('resize', function () { clearTimeout(timer); timer = setTimeout(fitNav, 100); });
  window.addEventListener('load', fitNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
  fitNav();
})();

// Formulario de certificaciones (certificaciones.html): valida y abre WhatsApp
(function () {
  'use strict';
  var form = document.getElementById('cert-form');
  if (!form) return;
  var cfg = window.XT_CONFIG || {};
  var number = String(cfg.whatsapp || '').replace(/\D/g, '');
  var fields = document.getElementById('cert-fields');
  var success = document.getElementById('cert-success');
  var error = document.getElementById('cert-error');
  var retry = document.getElementById('cert-retry');
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var nombre = form.nombre.value.trim();
    var tel = form.whatsapp.value.replace(/\D/g, '');
    var okNombre = nombre.length >= 2;
    var okTel = tel.length >= 10;
    form.nombre.setAttribute('aria-invalid', String(!okNombre));
    form.whatsapp.setAttribute('aria-invalid', String(!okTel));
    if (!(okNombre && okTel)) {
      error.hidden = false;
      (okNombre ? form.whatsapp : form.nombre).focus();
      return;
    }
    error.hidden = true;
    var area = form.area.value;
    var mensaje = form.mensaje.value.trim();
    var text = 'Hola XT Negocio, quiero información sobre certificaciones Certiprof.\n' +
      'Nombre: ' + nombre + '\n' +
      'WhatsApp: ' + tel +
      (area ? '\nÁrea de interés: ' + area : '') +
      (mensaje ? '\nCertificación u objetivo: ' + mensaje : '');
    var url = 'https://wa.me/' + number + '?text=' + encodeURIComponent(text);
    if (retry) retry.href = url;
    fields.hidden = true;
    success.hidden = false;
    window.open(url, '_blank', 'noopener');
  });
})();

// Animaciones de entrada al hacer scroll y botón "Volver arriba"
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce && 'IntersectionObserver' in window) {
    var targets = document.querySelectorAll('main .section-head, main .area, main .step, main .related-card, main .course, main .cert-includes li, main .why-item, main .path, main .catalog-cta, main .contact-card, main .gallery-item, main .video-item');
    if (targets.length) {
      document.documentElement.classList.add('reveal-on');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting || en.boundingClientRect.top < 0) { en.target.classList.add('is-visible'); io.unobserve(en.target); }
        });
      }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
      targets.forEach(function (el) {
        var r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) { el.classList.add('is-visible'); } else { el.classList.add('reveal'); io.observe(el); }
      });
      // Respaldo: si algo no se mostró en 4 s tras cargar, se muestra
      window.addEventListener('load', function () {
        setTimeout(function () { document.querySelectorAll('.reveal:not(.is-visible)').forEach(function (el) { if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('is-visible'); }); }, 4000);
      });
    }
  }

  if (document.body.scrollHeight < window.innerHeight * 2.5) return;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'to-top';
  btn.setAttribute('aria-label', 'Volver arriba');
  btn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5"/><path d="m6 11 6-6 6 6"/></svg>';
  document.body.appendChild(btn);
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(function () { var h = document.querySelector('.brand'); if (h) h.focus({ preventScroll: true }); }, reduce ? 0 : 400);
  });
  var onScroll = function () { btn.classList.toggle('is-shown', window.scrollY > window.innerHeight * 1.2); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
