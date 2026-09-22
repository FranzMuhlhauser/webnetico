/**
 * Cookie Banner — GDPR/Ley Chilena Compliance
 * Modular: se inyecta dinámicamente en todas las páginas.
 */
(function () {
  'use strict';

  var COOKIE_NAME = 'webnetico_cookie_consent';
  var COOKIE_VALUE_ACCEPTED = 'accepted';
  var COOKIE_VALUE_REJECTED = 'rejected';
  var COOKIE_EXPIRY_DAYS = 365;

  var BANNER_HTML =
    '<div id="cookie-overlay" class="cookie-overlay" aria-hidden="true"></div>' +
    '<div id="cookie-banner" class="cookie-banner" role="alert" aria-live="polite">' +
      '<button id="cookie-close" class="cookie-close" type="button" aria-label="Cerrar aviso de cookies">' +
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<div class="cookie-banner-content">' +
        '<div class="cookie-banner-icon">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"/><path d="M8.5 8.5v.01"/><path d="M16 15.5v.01"/><path d="M12 12v.01"/><path d="M11 17v.01"/><path d="M7 14v.01"/></svg>' +
        '</div>' +
        '<div class="cookie-banner-text">' +
          '<strong>Usamos cookies</strong>' +
          '<p>Utilizamos cookies propias y de terceros para <strong>mejorar su experiencia</strong>, analizar tráfico y personalizar contenido.</p>' +
          '<div class="cookie-banner-links">' +
            '<a href="/privacy#cookies">Política de Cookies</a>' +
            '<span class="cookie-divider">•</span>' +
            '<a href="/privacy">Política de Privacidad</a>' +
          '</div>' +
        '</div>' +
        '<div class="cookie-banner-actions">' +
          '<button id="cookie-reject" class="cookie-btn cookie-btn-secondary" type="button" aria-label="Rechazar cookies">Rechazar</button>' +
          '<button id="cookie-accept" class="cookie-btn cookie-btn-primary" type="button" aria-label="Aceptar todas las cookies">Aceptar</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  function getCookie(name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  }

  function setCookie(name, value, days) {
    var expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + '=' + value + ';expires=' + expires.toUTCString() + ';path=/;SameSite=Lax';
  }

  // El aviso de cookies ocupa la franja inferior de la pantalla y TAPABA el
  // botón de WhatsApp: en móvil el aviso mide ~325 px y el botón quedaba
  // debajo, así que el toque caía en «Aceptar». Mientras el aviso está visible
  // se marca el <body> y se publica su altura, para que el botón suba por
  // encima. (El estilo está en css/base.css, regla body.cookie-abierto.)
  function ajustaBotonWhatsapp(visible) {
    if (!document.body) return;
    var banner = document.getElementById('cookie-banner');
    if (visible && banner) {
      document.body.style.setProperty('--cookie-alto', banner.offsetHeight + 'px');
      document.body.classList.add('cookie-abierto');
    } else {
      document.body.classList.remove('cookie-abierto');
    }
  }

  function showBanner() {
    var banner = document.getElementById('cookie-banner');
    var overlay = document.getElementById('cookie-overlay');
    if (banner) banner.classList.add('cookie-banner-visible');
    if (overlay) {
      overlay.classList.add('cookie-overlay-visible');
      overlay.setAttribute('aria-hidden', 'false');
    }
    ajustaBotonWhatsapp(true);
  }

  function hideBanner() {
    var banner = document.getElementById('cookie-banner');
    var overlay = document.getElementById('cookie-overlay');
    if (banner) banner.classList.remove('cookie-banner-visible');
    if (overlay) {
      overlay.classList.remove('cookie-overlay-visible');
      overlay.setAttribute('aria-hidden', 'true');
    }
    ajustaBotonWhatsapp(false);
  }

  function handleAccept() {
    setCookie(COOKIE_NAME, COOKIE_VALUE_ACCEPTED, COOKIE_EXPIRY_DAYS);
    hideBanner();
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({ event: 'cookie_consent', consent: 'granted' });
    }
  }

  function handleReject() {
    setCookie(COOKIE_NAME, COOKIE_VALUE_REJECTED, COOKIE_EXPIRY_DAYS);
    hideBanner();
    if (typeof dataLayer !== 'undefined') {
      dataLayer.push({ event: 'cookie_consent', consent: 'denied' });
    }
  }

  function init() {
    var consent = getCookie(COOKIE_NAME);
    if (!consent) {
      var wrapper = document.createElement('div');
      wrapper.id = 'cookie-banner-wrapper';
      wrapper.innerHTML = BANNER_HTML;
      document.body.appendChild(wrapper);
      setTimeout(showBanner, 500);
    }

    document.addEventListener('click', function (e) {
      if (e.target.id === 'cookie-accept' || e.target.closest('#cookie-accept'))
        handleAccept();
      else if (e.target.id === 'cookie-reject' || e.target.closest('#cookie-reject'))
        handleReject();
      else if (e.target.id === 'cookie-close' || e.target.closest('#cookie-close'))
        handleReject();
      else if (e.target.id === 'cookie-overlay') handleReject();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        var banner = document.getElementById('cookie-banner');
        if (banner && banner.classList.contains('cookie-banner-visible')) handleReject();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
