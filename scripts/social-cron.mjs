import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const ARTICLES = [
  {
    slug: 'wordpress-vs-codigo-puro',
    title: '¿WordPress o código puro? La verdad sobre seguridad y velocidad',
    excerpt: 'Descubre las diferencias reales entre WordPress y código puro. Seguridad, velocidad, costos ocultos y qué opción conviene más para tu negocio en Chile.',
    tags: ['Tecnología Web', 'Seguridad'],
    readingTime: 7,
  },
  {
    slug: 'que-es-geo',
    title: '¿Qué es GEO y por qué tu negocio necesita aparecer en la IA?',
    excerpt: 'Generative Engine Optimization: la nueva disciplina que posiciona tu negocio en ChatGPT, Perplexity y Google AI Overviews.',
    tags: ['Tendencias 2026', 'IA', 'SEO'],
    readingTime: 8,
  },
  {
    slug: 'checklist-seo-pymes',
    title: 'Checklist SEO para Pymes: 10 cosas que tu web debe tener',
    excerpt: '10 elementos esenciales que toda web debe tener para posicionar en Google. Desde HTTPS y velocidad hasta datos estructurados y Google Business Profile.',
    tags: ['SEO', 'Guía Práctica'],
    readingTime: 9,
  },
  {
    slug: 'mejor-hosting-web-chile',
    title: 'Cómo elegir hosting para tu página web en Chile: guía 2026',
    excerpt: 'Comparativa de proveedores, tipos de hosting, precios y qué considerar antes de contratar.',
    tags: ['Hosting', 'Guía Técnica'],
    readingTime: 7,
  },
  {
    slug: 'cuanto-cuesta-una-pagina-web-en-chile',
    title: '¿Cuánto cuesta una página web en Chile? Guía de precios 2026',
    excerpt: 'Rangos de precio desde $320.000 CLP + IVA hasta $3.000.000+ CLP según tipo de proyecto.',
    tags: ['Guía de Precios'],
    readingTime: 8,
  },
];

const BASE_URL = 'https://www.webnetico.cl/blog/';
const HASHTAGS = ['#DiseñoWeb', '#SEO', '#Chile', '#Pymes', '#Webnetico', '#TransformaciónDigital'];

function linkedinPost(article) {
  const url = BASE_URL + article.slug;
  const tagLine = article.tags.map((t) => `#${t.replace(/\s+/g, '')}`).join(' ');
  return [
    `📝 ${article.title}`,
    '',
    article.excerpt,
    '',
    `⏱ ${article.readingTime} min de lectura  |  ${tagLine}`,
    '',
    `👉 ${url}`,
  ].join('\n');
}

function instagramPost(article) {
  const url = BASE_URL + article.slug;
  const emoji = '💻';
  return [
    `${emoji} ${article.title}`,
    '',
    article.excerpt.slice(0, 140) + '...',
    '',
    `🔗 Lee el artículo completo en el enlace de nuestra bio.`,
    `#DiseñoWeb #SEO #NegociosDigitales #Webnetico`,
  ].join('\n');
}

function twitterPost(article) {
  const url = BASE_URL + article.slug;
  const hashTags = HASHTAGS.slice(0, 3).join(' ');
  const body = article.excerpt.slice(0, 200);
  return `${article.title.slice(0, 80)}\n\n${body}...\n\n${url}\n\n${hashTags}`;
}

function generateReport() {
  const now = new Date().toISOString().slice(0, 10);
  const lines = [];

  lines.push(`=== Webnetico Social Media Content — ${now} ===`);
  lines.push('');
  lines.push('Postea manualmente o programa con Buffer/Hootsuite/Later.');
  lines.push('Frecuencia sugerida: 2-3 posts por semana, rotando artículos.');
  lines.push('');

  for (const article of ARTICLES) {
    lines.push(`─────────────────────────────────────────────`);
    lines.push(`📌 Artículo: ${article.title}`);
    lines.push(`─────────────────────────────────────────────`);
    lines.push('');
    lines.push('--- LinkedIn ---');
    lines.push(linkedinPost(article));
    lines.push('');
    lines.push('--- Instagram ---');
    lines.push(instagramPost(article));
    lines.push('');
    lines.push('--- X (Twitter) ---');
    lines.push(twitterPost(article));
    lines.push('');
    lines.push('');
  }

  lines.push('=== Fin del reporte ===');
  lines.push(`Total artículos: ${ARTICLES.length}`);
  lines.push(`Total posts generados: ${ARTICLES.length * 3} (3 plataformas x artículo)`);

  const report = lines.join('\n');
  const outPath = resolve(ROOT, 'scripts', `social-posts-${now}.txt`);

  writeFileSync(outPath, report, 'utf-8');
  console.log(`✅ Reporte generado: ${outPath}`);
  console.log(`   ${ARTICLES.length} artículos × 3 plataformas = ${ARTICLES.length * 3} posts`);
  console.log('');

  for (const article of ARTICLES) {
    console.log(`📄 ${article.title}`);
    console.log(`   🔗 ${BASE_URL}${article.slug}`);
    console.log('');
  }
}

generateReport();
