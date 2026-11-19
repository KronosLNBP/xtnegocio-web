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
