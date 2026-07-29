# Webnetico - Agencia de Ingeniería Web y Soluciones Digitales

## Descripción

Webnetico es una agencia especializada en el desarrollo de sitios web de alto rendimiento, optimización SEO avanzada (incluyendo GEO y AEO) y mantenimiento de seguridad web en Chile.

Este proyecto está construido con **código puro (Vanilla JavaScript, HTML5 y CSS3)**, garantizando una velocidad de carga extrema, seguridad impenetrable y una experiencia de usuario fluida sin las dependencias pesadas de CMS tradicionales.

## Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 Moderno (Flexbox & Grid).
- **Lógica**: Vanilla JavaScript (ES6+).
- **Optimización**:
  - **SEO**: Motores de búsqueda tradicionales.
  - **GEO**: Optimización para motores generativos (IA).
  - **AEO**: Optimización para respuestas de voz y asistentes.
- **Componentes**: Carga dinámica de Header, Footer y Chatbot de WhatsApp para facilitar la mantenibilidad.

## Estructura del Proyecto

- `index.html`: Página principal.
- `services.html`: Detalle de servicios de diseño y mantenimiento.
- `portfolio.html`: Casos de éxito y portafolio de proyectos.
- `about.html`: Página "Sobre mí" con foto, biografía y Person + BreadcrumbList + Speakable schema.
- `blog.html`: Listado de artículos del blog con CollectionPage schema.
- `blog/`: Artículos del blog (cada uno con Article + FAQPage schema).
- `insights.html`: Artículos y contenido de autoridad.
- `contact.html`: Formulario de contacto avanzado.
- `diseno-web-santiago.html`: Landing SEO para diseño web en Santiago.
- `diseno-web-vina.html`: Landing SEO para diseño web en Viña del Mar.
- `diseno-web-valparaiso.html`: Landing SEO para diseño web en Valparaíso.
- `precio-diseno-web-chile.html`: Landing SEO para precios de diseño web en Chile.
- `components/`: Fragmentos de HTML reutilizables (Header, Footer, WhatsApp).
- `css/`: Estilos globales y específicos.
- `js/`: Lógica del sitio, carga de componentes y gestión de formularios.
- `images/`: Recursos visuales optimizados en formato WebP y SVG.
- `sitemap.xml`: Sitemap con todas las URLs del sitio.
- `robots.txt`: Configuración de crawling.
- `docs/`: Documentación técnica y de investigación.

## Características Destacadas

- **Velocidad Extrema**: Sin plugins ni bases de datos SQL.
- **Seguridad Nativa**: Inmune a ataques comunes orientados a WordPress.
- **Chatbot de WhatsApp Inteligente**: Sistema de filtrado y asistencia automatizada.
- **Diseño Responsive**: Totalmente adaptado a dispositivos móviles.

## Configuración del Formulario de Contacto

El formulario utiliza una **Vercel Serverless Function** situada en `/api/contact.js` que se comunica con la API de **Resend**.

Para que funcione, debes configurar las siguientes variables de entorno en tu panel de Vercel (**Settings > Environment Variables**):

- `RESEND_API_KEY`: Tu API Key de Resend (comienza con `re_`).
- `FROM_EMAIL`: El email desde el cual se enviará el correo (debe estar verificado en Resend, ej: `Webnetico <contacto@webnetico.cl>`).
- `TO_EMAIL`: El email que recibirá las consultas (tu correo de Zoho, ej: `contacto@webnetico.cl`).

---

© 2026 Webnetico Engineering. Valparaíso, Chile.

## Usar pnpm (recomendado)

Se recomienda usar `pnpm` en lugar de `npm` para instalar dependencias y evitar problemas de seguridad asociados al lockfile. Pasos rápidos:

```bash
# Habilita Corepack (gestor de paquetes incluido en Node moderno)
corepack enable

# Prepara y activa pnpm (instala localmente la versión indicada)
corepack prepare pnpm@latest --activate

# Instala dependencias con pnpm
pnpm install
```

Si prefieres no usar Corepack, instala pnpm globalmente:

```bash
npm install -g pnpm
pnpm install
```

## Analytics y bloqueadores de anuncios

Hemos cambiado la inclusión automática de Vercel Insights/Speed Insights a un cargador opt-in (`js/insights-optin.js`) para evitar errores en consola causados por extensiones tipo adblock (`net::ERR_BLOCKED_BY_CLIENT`).

- Para habilitar las métricas en tu navegador localmente, ejecuta en la consola del sitio:

```js
localStorage.setItem('allowInsights','1');
// o llamar a la función expuesta
window.enableInsights && window.enableInsights();
```

- Si quieres probar sin interferencias, desactiva temporalmente el adblocker para el dominio.
- Si prefieres que las métricas estén siempre activas, podemos añadir un banner de consentimiento y habilitarlas automáticamente cuando el usuario acepte.

## Historial de correcciones SEO

### 2026-07-29 — Corrección de indexación y redirecciones (v1.4.1)

**Problema:** 20 incidencias en Google Search Console (noindex contradictorio, 404s, redirects rotos).

**Correcciones aplicadas:**
1. **noindex eliminado** de `terms.html` y `privacy.html` — ambas tenían `noindex` pese a estar en el sitemap, enviando señales contradictorias a Google.
2. **7 redirects 301** agregados en `vercel.json`:
   - 4 para URLs `.html` con error de redirección: `/diseno-web-vina.html`, `/blog/cuanto-cuesta-una-pagina-web-en-chile.html`, `/contact.html`, `/portfolio.html`
   - 3 para rutas viejas en español con 404: `/sobre-nosotros` → `/about`, `/servicios` → `/services`, `/portafolio` → `/portfolio`
3. **Sitemap regenerado** con `lastmod` reales desde `git log` para las 14 URLs.

**Pendiente:** Solicitar indexación manual desde Search Console para las 14 URLs después del próximo deploy.
