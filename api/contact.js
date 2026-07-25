import { escapeHtml, stripNewlines, isValidEmail, createRateLimiter } from './utils.js';

const ALLOWED_ORIGIN = 'https://www.webnetico.cl';
const MAX_NAME_LENGTH = 100;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

const isRateLimited = createRateLimiter();

export default async function handler(req, res) {
  const origin = req.headers && req.headers.origin;
  if (origin && origin !== ALLOWED_ORIGIN) {
    return res.status(403).json({ error: 'Origen no permitido' });
  }
  res.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Demasiadas solicitudes. Intenta nuevamente en un minuto.' });
  }

  const { name, email, subject, urgency, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Formato de email inválido' });
  }

  if (name.length > MAX_NAME_LENGTH) {
    return res.status(400).json({ error: 'El nombre excede el límite permitido' });
  }
  if ((subject || '').length > MAX_SUBJECT_LENGTH) {
    return res.status(400).json({ error: 'El asunto excede el límite permitido' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: 'El mensaje excede el límite permitido' });
  }

  const safeName = escapeHtml(stripNewlines(name));
  const safeEmailRaw = stripNewlines(email);
  const safeEmailDisplay = escapeHtml(safeEmailRaw);
  const safeSubject = escapeHtml(stripNewlines(subject || 'No especificado'));
  const safeUrgency = escapeHtml(stripNewlines(urgency || 'No especificada'));
  const safeMessage = escapeHtml(stripNewlines(message));

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const DEBUG = process.env.DEBUG === '1' || process.env.DEBUG === 'true';

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'Error de configuración del servidor' });
  }

  try {
    if (DEBUG) {
      try {
        console.log('[DEBUG] /api/contact request method:', req.method);
        console.log('[DEBUG] /api/contact request keys:', Object.keys(req.body || {}));
      } catch (e) {}
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Contactos Webnético <contacto@webnetico.cl>',
        to: 'contacto@webnetico.cl',
        subject: `Lead Webnético: ${safeSubject || 'Consulta'} ${safeUrgency ? `(${safeUrgency})` : ''}`,
        reply_to: safeEmailRaw,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #22c55e;">Nuevo Lead - Webnético.cl</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${encodeURIComponent(safeEmailRaw)}">${safeEmailDisplay}</a></p>
            <p><strong>Asunto:</strong> ${safeSubject}</p>
            <p><strong>Urgencia:</strong> ${safeUrgency}</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <strong>Mensaje:</strong><br>
              <p style="white-space: pre-wrap;">${safeMessage}</p>
            </div>
            <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
            <small style="color: #666;">Enviado desde webnetico.cl el ${new Date().toLocaleString('es-CL', { timeZone: 'America/Santiago' })}</small>
          </div>
        `,
      }),
    });

    let resendText = '';
    try {
      resendText = await response.text();
    } catch (e) {
      resendText = '';
    }

    let data = null;
    try {
      data = resendText ? JSON.parse(resendText) : null;
    } catch (e) {
      data = null;
    }

    if (DEBUG) {
      try {
        console.log('[DEBUG] /api/contact resend status:', response.status);
      } catch (e) {}
    }

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(400).json({ error: 'Error al enviar el mensaje. Intenta nuevamente.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
}
