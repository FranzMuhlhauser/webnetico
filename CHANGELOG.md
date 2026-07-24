# Changelog

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
