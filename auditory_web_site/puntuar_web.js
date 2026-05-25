#!/usr/bin/env node
import readline from 'readline';

const categories = [
  { nombre: 'SEO Tecnico', peso: 15 },
  { nombre: 'AEO', peso: 10 },
  { nombre: 'GEO', peso: 10 },
  { nombre: 'Performance Build', peso: 15 },
  { nombre: 'Core Web Vitals', peso: 10 },
  { nombre: 'Optimizacion Medios', peso: 5 },
  { nombre: 'Responsive UX Movil', peso: 10 },
  { nombre: 'UX General', peso: 5 },
  { nombre: 'Accesibilidad', peso: 10 },
  { nombre: 'Seguridad', peso: 10 },
];

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function ask(question) {
  return new Promise((res) => rl.question(question, (answer) => res(answer)));
}

function escapeXml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

async function doComputeAndPrint(results) {
  // Calcula puntaje ponderado
  let total = 0;
  for (const r of results) {
    const nota = r.nota === 'N/A' ? 0 : Number(r.nota);
    total += (nota * r.peso) / 10; // porque nota 10 -> peso completo
  }
  const puntajePonderado = Math.round(total);

  let estado = '🔴 NO APROBADO';
  if (puntajePonderado >= 90) estado = '🟢 APROBADO';
  else if (puntajePonderado >= 75) estado = '🟡 CONDICIONAL';

  // Imprime solo el XML estricto solicitado
  console.log('<Puntuacion_Final>');
  for (const r of results) {
    const notaAttr = r.nota === 'N/A' ? 'N/A' : `${r.nota}/10`;
    const justEsc = escapeXml(r.justificacion);
    const nameEsc = escapeXml(r.nombre);
    console.log(`  <Categoria nombre="${nameEsc}" nota="${notaAttr}" justificacion="${justEsc}"/>`);
  }
  console.log(`  <Puntaje_Ponderado>${puntajePonderado}/100</Puntaje_Ponderado>`);
  console.log(`  <Estado_Entrega>${estado}</Estado_Entrega>`);
  console.log('</Puntuacion_Final>');
}

async function mainInteractive() {
  const results = [];
  for (const cat of categories) {
    let notaInput;
    while (true) {
      notaInput = (await ask(`Puntaje para '${cat.nombre}' (0-10 o N/A): `)).trim();
      if (!notaInput) {
        console.log("Entrada vacía no permitida. Escribe 0-10 o N/A.");
        continue;
      }
      const up = notaInput.toUpperCase();
      if (up === 'N/A') {
        notaInput = 'N/A';
        break;
      }
      const num = Number(notaInput);
      if (!Number.isNaN(num) && num >= 0 && num <= 10) {
        notaInput = String(num);
        break;
      }
      console.log('Valor inválido. Usa un número entre 0 y 10, o N/A.');
    }

    let justif = (await ask('Justificación técnica (1 línea): ')).trim();
    if (!justif) {
      justif = 'N/A - Requiere: falta justificación';
    }
    results.push({ nombre: cat.nombre, nota: notaInput, justificacion: justif, peso: cat.peso });
  }
  rl.close();
  await doComputeAndPrint(results);
}

function mainFromStdin(allText) {
  const lines = allText.replace(/\r/g, '').split(/\n/).map(l => l.trim()).filter(() => true);
  const results = [];
  let idx = 0;
  for (const cat of categories) {
    const notaLine = lines[idx++] ?? '';
    const justLine = lines[idx++] ?? '';
    const nota = notaLine ? (notaLine.toUpperCase() === 'N/A' ? 'N/A' : (isNaN(Number(notaLine)) ? 'N/A' : String(Number(notaLine)))) : 'N/A';
    const just = justLine || 'N/A - Requiere: falta justificación';
    results.push({ nombre: cat.nombre, nota, justificacion: just, peso: cat.peso });
  }
  doComputeAndPrint(results);
}

if (process.stdin.isTTY) {
  mainInteractive();
} else {
  // leer stdin completo
  let data = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', chunk => data += chunk);
  process.stdin.on('end', () => mainFromStdin(data));
}
