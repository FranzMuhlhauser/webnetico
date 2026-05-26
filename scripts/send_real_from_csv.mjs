import fs from 'fs/promises';
import path from 'path';
import handler from '../api/contact.js';

const csvPath = '/home/fmuhlhauser/Descargas/api-keys-1779754764508.csv';

function makeRes(){
  return {
    headers: {},
    setHeader(k,v){ this.headers[k]=v },
    _status: 200,
    status(code){ this._status = code; return this },
    json(obj){ console.log('HANDLER JSON RESPONSE:', obj); }
  };
}

async function main(){
  const txt = await fs.readFile(csvPath, 'utf8');
  const lines = txt.replace(/\r/g,'').split('\n').filter(Boolean);
  if (lines.length < 2) throw new Error('CSV no contiene filas');
  const headers = lines[0].split(',').map(h=>h.trim());
  const values = lines[1].split(',');
  const tokenIndex = headers.indexOf('token');
  if (tokenIndex === -1) throw new Error('CSV no tiene columna token');
  const token = values[tokenIndex];
  if (!token || !token.startsWith('re_')) throw new Error('Token parece inválido');

  // Set env var for handler (do NOT print the token)
  process.env.RESEND_API_KEY = token;
  console.log('RESEND_API_KEY loaded from CSV (masked). Proceeding to call handler...');

  const req = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: {
      name: 'Prueba Local',
      email: 'prueba@example.com',
      subject: 'Prueba automatizada',
      urgency: 'baja',
      message: 'Mensaje de prueba enviado desde script local para validar integración.'
    }
  };

  const res = makeRes();
  await handler(req, res);

  // delete CSV for security
  try {
    await fs.unlink(csvPath);
    console.log('CSV file deleted for security:', csvPath);
  } catch (e) {
    console.warn('Could not delete CSV file:', e.message);
  }
}

main().catch(e=>{ console.error('Error running test:', e); process.exit(1)});
