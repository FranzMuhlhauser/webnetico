// insights-optin.js
// Carga Vercel Insights y Speed Insights solo si el usuario ha dado consentimiento
(function () {
  function loadInsights() {
    try {
      const s1 = document.createElement('script');
      s1.defer = true;
      s1.src = '/_vercel/insights/script.js';
      document.body.appendChild(s1);

      const s2 = document.createElement('script');
      s2.defer = true;
      s2.src = '/_vercel/speed-insights/script.js';
      document.body.appendChild(s2);
    } catch (e) {
      // ignore
    }
  }

  window.enableInsights = function () {
    try {
      localStorage.setItem('allowInsights', '1');
    } catch (e) {}
    loadInsights();
  };

  try {
    if (localStorage.getItem('allowInsights') === '1') {
      loadInsights();
    }
  } catch (e) {}
})();
