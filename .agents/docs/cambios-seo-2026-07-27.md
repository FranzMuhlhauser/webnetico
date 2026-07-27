# Cambios SEO — Limpieza de URLs y Sitemap (2026-07-27)

## Objetivo

Unificar todas las URLs del sitio para que sean consistentes con `cleanUrls: true` de Vercel (sin extensión `.html`) y agregar la página `blog.html` al sitemap.

## Cambios realizados

### 1. Canonical, hreflang y og:url — 9 archivos, 26 URLs

Se quitó `.html` de todas las URLs en los tags SEO de las siguientes páginas:

| Archivo | URLs modificadas |
|---|---|
| `about.html` | canonical, hreflang, og:url |
| `blog.html` | canonical, hreflang, og:url |
| `contact.html` | canonical, hreflang, og:url |
| `insights.html` | canonical, hreflang, og:url |
| `portfolio.html` | canonical, hreflang, og:url |
| `privacy.html` | canonical, hreflang, og:url |
| `services.html` | canonical, hreflang, og:url |
| `terms.html` | canonical, hreflang, og:url |
| `404.html` | canonical, hreflang |

**Ejemplo:**
```html
<!-- Antes -->
<link rel="canonical" href="https://www.webnetico.cl/about.html" />
<meta property="og:url" content="https://www.webnetico.cl/about.html" />

<!-- Después -->
<link rel="canonical" href="https://www.webnetico.cl/about" />
<meta property="og:url" content="https://www.webnetico.cl/about" />
```

### 2. JSON-LD structured data — 10 archivos, 22 URLs

Se quitó `.html` de todas las URLs dentro de los bloques `<script type="application/ld+json">`:

| Archivo | URLs modificadas |
|---|---|
| `index.html` | 1 (insights URL en Article) |
| `about.html` | 3 (Person.url, BreadcrumbList, WebPage) |
| `services.html` | 2 (BreadcrumbList, WebPage) |
| `portfolio.html` | 1 (CollectionPage.url) |
| `blog.html` | 2 (BreadcrumbList, CollectionPage) |
| `insights.html` | 6 (BreadcrumbList, CollectionPage, 4x Article) |
| `privacy.html` | 2 (BreadcrumbList, PrivacyPolicy) |
| `terms.html` | 2 (BreadcrumbList, TermsOfService) |
| `404.html` | 1 (WebPage) |
| `blog/cuanto-cuesta-una-pagina-web-en-chile.html` | 2 (Author, BreadcrumbList) |

### 3. Sitemap XML

- Se agregó la página `blog.html` (nueva entrada: `https://www.webnetico.cl/blog`)
- Se quitó `.html` de todas las URLs existentes
- Se reordenaron las entradas para mejor legibilidad

**Total de páginas en sitemap: 14** (antes 13)

## Archivos no modificados (ya estaban limpios)

- `index.html` — canonical, hreflang, og:url ya usaban `/`
- `diseno-web-santiago.html` — ya usaban URLs limpias
- `diseno-web-vina.html` — ya usaban URLs limpias
- `diseno-web-valparaiso.html` — ya usaban URLs limpias
- `precio-diseno-web-chile.html` — ya usaban URLs limpias
- `blog/cuanto-cuesta-una-pagina-web-en-chile.html` — canonical, hreflang, og:url ya usaban URLs limpias

## Verificación

Grep confirmó 0 URLs `.html` restantes en tags SEO y sitemap.

## Próximos pasos (requeridos manualmente)

### 1. Reenviar sitemap
- Ir a Google Search Console → Sitemaps
- Pegar: `https://www.webnetico.cl/sitemap.xml`
- Clic en "Enviar"

### 2. Solicitar indexación de cada página
- Ir a Google Search Console → Extracción de URLs
- Pegar cada URL y solicitar indexación:

| # | URL |
|---|---|
| 1 | `https://www.webnetico.cl/` |
| 2 | `https://www.webnetico.cl/services` |
| 3 | `https://www.webnetico.cl/portfolio` |
| 4 | `https://www.webnetico.cl/about` |
| 5 | `https://www.webnetico.cl/blog` |
| 6 | `https://www.webnetico.cl/blog/cuanto-cuesta-una-pagina-web-en-chile` |
| 7 | `https://www.webnetico.cl/insights` |
| 8 | `https://www.webnetico.cl/diseno-web-santiago` |
| 9 | `https://www.webnetico.cl/diseno-web-vina` |
| 10 | `https://www.webnetico.cl/diseno-web-valparaiso` |
| 11 | `https://www.webnetico.cl/precio-diseno-web-chile` |
| 12 | `https://www.webnetico.cl/contact` |

## Nota técnica

Vercel con `cleanUrls: true` ya redirige 301 automáticamente de `/*.html` a `/*`, así que los usuarios y motores de búsqueda ya eran redirigidos. Este cambio asegura que canonical, structured data y sitemap sean consistentes con la URL que realmente se sirve.
