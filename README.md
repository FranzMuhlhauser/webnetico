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
- `insights.html`: Artículos y contenido de autoridad.
- `contact.html`: Formulario de contacto avanzado.
- `components/`: Fragmentos de HTML reutilizables (Header, Footer, WhatsApp).
- `css/`: Estilos globales y específicos.
- `js/`: Lógica del sitio, carga de componentes y gestión de formularios.
- `images/`: Recursos visuales optimizados en formato WebP y SVG.

## Características Destacadas

- **Velocidad Extrema**: Sin plugins ni bases de datos SQL.
- **Seguridad Nativa**: Inmune a ataques comunes orientados a WordPress.
- **Chatbot de WhatsApp Inteligente**: Sistema de filtrado y asistencia automatizada.
- **Diseño Responsive**: Totalmente adaptado a dispositivos móviles.

## Configuración del Formulario de Contacto

El formulario utiliza una **Vercel Serverless Function** situada en `/api/contact.js` que se comunica con la API de **Resend**.

Para que funcione, debes configurar las siguientes variables de entorno en tu panel de Vercel (**Settings > Environment Variables**):

- `RESEND_API_KEY`: Tu API Key de Resend (comienza con `re_`).
- `FROM_EMAIL`: El email desde el cual se enviará el correo (debe estar verificado en Resend, ej: `Webnetico <hola@webnetico.cl>`).
- `TO_EMAIL`: El email que recibirá las consultas (tu correo de Zoho, ej: `hola@webnetico.cl`).

---

© 2026 Webnetico Engineering. Valparaíso, Chile.
