# Changelog

## [1.4.1] - 2026-07-29

### Fixed

- **terms.html + privacy.html**: Quitado `<meta name="robots" content="noindex">`. Ambas páginas tenían `noindex` a pesar de estar incluidas en el sitemap, enviando señales contradictorias a Google. Cambiado a `index, follow`.
- **vercel.json**: Agregadas 7 redirecciones 301 permanentes:
  - 4 para resolver errores de redirección en URLs con `.html` (`/diseno-web-vina.html`, `/blog/cuanto-cuesta-una-pagina-web-en-chile.html`, `/contact.html`, `/portfolio.html`)
  - 3 para rutas viejas en español sin redirección (`/sobre-nosotros` → `/about`, `/servicios` → `/services`, `/portafolio` → `/portfolio`)
- **sitemap.xml**: Regenerado con `lastmod` reales desde `git log` para las 14 URLs.

### Archivos modificados

- `privacy.html` — noindex → index
- `terms.html` — noindex → index
- `vercel.json` — nuevo bloque `redirects` con 7 reglas
- `sitemap.xml` — lastmod actualizados por URL

## [1.4.0] - 2026-07-27

### Added

- **privacy.html**: Header completo (logo, nav, menú móvil, CTA), WhatsApp drawer multi-step, cookie banner.
- **terms.html**: Header completo (logo, nav, menú móvil, CTA), WhatsApp drawer multi-step, cookie banner.
- **404.html**: Header completo, footer completo, WhatsApp drawer multi-step, cookie banner.

### Changed

- **Analytics**: Migración de GTM de eager (snippet en `<head>`) a lazy loader por interacción en `privacy.html`, `terms.html` y `404.html` — consistente con el resto del sitio. GTM se carga al primer scroll, mousemove, touchstart o click, con fallback a 4 segundos.

## [1.3.0] - 2026-07-25

### Added

- **about.html**: Página "Sobre mí" con foto, biografía y Person + BreadcrumbList + Speakable schema.
- **blog.html**: Listado del blog con CollectionPage schema y tarjeta de artículo.
- **blog/cuanto-cuesta-una-pagina-web-en-chile.html**: Artículo completo con tabla de precios, FAQ accordion, Article + BreadcrumbList + FAQPage + WebPage schema.
- **diseno-web-santiago.html**: Landing SEO para diseño web en Santiago (BreadcrumbList + WebPage + FAQPage schema).
- **diseno-web-vina.html**: Landing SEO para diseño web en Viña del Mar (BreadcrumbList + WebPage + FAQPage schema).
- **diseno-web-valparaiso.html**: Landing SEO para diseño web en Valparaíso (BreadcrumbList + WebPage + FAQPage schema).
- **precio-diseno-web-chile.html**: Landing SEO para precios de diseño web en Chile (BreadcrumbList + WebPage + FAQPage schema).
- **Link "Blog"** agregado al nav y footer de todas las páginas.

### Fixed

- **URLs canónicas en blog article**: eliminada extensión .html para compatibilidad con `cleanUrls` en vercel.json.
- **Precios en blog article**: actualizados según investigación de mercado (Web Express: $250k, Landing: $350k, Multi: $550k).
- **robots.txt**: regla `Disallow: /*?` eliminada.
- **services.html**: precios corregidos en JSON-LD ($250k / $350k / $550k).

### Changed

- **about.html**: hero actualizado con datos del CV, tagline profesional.
- **insights.html**: enlace directo al artículo reemplazado por enlace al listado blog.html.
- **sitemap.xml**: URLs nuevas agregadas (about, blog, 4 landings).

---

## [1.1.1] - 2026-07-24

### Corregido

- **Botón "Diagnóstico Gratuito" en header**: Invisible en varias páginas y texto desaparecía al hover
  - Eliminada definición duplicada de `.btn-secondary` que sobreescribía el color de borde/texto con valores casi invisibles sobre fondo oscuro
  - Eliminado `display: none` en `.header-cta` para mostrar el botón en móvil (≤768px)
  - Agregado sizing responsive para `.btn-header-cta` en móvil
  - Agregado override `.site-header.theme-light .btn-secondary` para compatibilidad con header claro

### Archivos modificados

- `css/styles.css` — Corrección de estilos del botón header
- `css/styles.min.css` — Versión minificada regenerada

---

## [1.1.0] - 2026-07-24

### Mejorado

- **Banner de cookies**: Rediseño completo del componente de consentimiento de cookies
  - Reemplazado emoji 🍪 por SVG inline (consistencia con iconografía del proyecto)
  - Agregado overlay semitransparente con `backdrop-filter: blur()` para aislamiento visual
  - Agregado botón de cierre (X) con SVG para melhor UX
  - Agregados `focus-visible` rings en botones y enlaces (WCAG 2.2 AA)
  - Transición de entrada refinada: `cubic-bezier(0.16, 1, 0.3, 1)` (spring-like)
  - Texto optimizado para escaneabilidad (negrita en keywords)
  - Botones con `min-height: 44px` para touch targets (WCAG)
  - Jerarquía visual mejorada entre Aceptar/Rechazar
  - Soporte completo para temas light/grey con variables CSS

### Archivos modificados

- `components/cookie-banner.html` — Plantilla canónica actualizada
- `css/styles.css` — Estilos del banner de cookies (overlay, backdrop, focus, transición)
- `css/styles.min.css` — Versión minificada regenerada
- `index.html` — Banner propagado
- `services.html` — Banner propagado
- `contact.html` — Banner propagado
- `portfolio.html` — Banner propagado
- `insights.html` — Banner propagado
- `404.html` — Banner propagado

### Notas técnicas

- Lógica JS de consentimiento sin cambios (cookie `webnetico_cookie_consent`, dataLayer events)
- Nuevos elementos: `#cookie-overlay`, `#cookie-close`
- Event listeners actualizados para manejar overlay y botón X
- `e.target.closest()` agregado para compatibilidad con elementos SVG internos
