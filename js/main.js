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

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
