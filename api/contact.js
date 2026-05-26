const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export default async function handler(req, res) {
  // Añadir cabeceras CORS para permitir preflight (OPTIONS) desde el cliente
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Responder al preflight sin procesar body
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  const { name, email, subject, urgency, message } = req.body;

  const safeName = escapeHtml(name);
  const safeEmailDisplay = escapeHtml(email);
  const safeSubject = escapeHtml(subject || 'No especificado');
  const safeUrgency = escapeHtml(urgency || 'No especificada');
  const safeMessage = escapeHtml(message);

  // Validación server-side
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const DEBUG = process.env.DEBUG === '1' || process.env.DEBUG === 'true';

  if (!RESEND_API_KEY) {
    return res.status(500).json({ 
      error: 'Error de configuración', 
      message: 'La variable RESEND_API_KEY no se encuentra en Vercel. Debes agregarla en Settings > Environment Variables y hacer REDEPLOY.' 
    });
  }

  try {
    if (DEBUG) {
      try {
        console.log('[DEBUG] /api/contact request method:', req.method);
        console.log('[DEBUG] /api/contact request keys:', Object.keys(req.body || {}));
        // mostrar origen y content-type para diagnostico
        console.log('[DEBUG] /api/contact headers:', {
          origin: req.headers && req.headers.origin,
          referer: req.headers && req.headers.referer,
          'content-type': req.headers && req.headers['content-type'],
        });
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
        reply_to: safeEmailDisplay, // Permite responder directamente al cliente (sanitizado)
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #22c55e;">🆕 Nuevo Lead - Webnético.cl</h2>
            <p><strong>Nombre:</strong> ${safeName}</p>
            <p><strong>Email:</strong> <a href="mailto:${safeEmailDisplay}">${safeEmailDisplay}</a></p>
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

    // Manejar posibles respuestas no JSON de Resend
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
        console.log('[DEBUG] /api/contact resend preview:', {
          status: response.status,
          statusText: response.statusText,
          bodyPreview: resendText ? (resendText.length > 1000 ? resendText.slice(0, 1000) + '...[truncated]' : resendText) : null,
        });
      } catch (e) {}
    }

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {
      const msg = (data && (data.error || data.message)) || resendText || 'Error de Resend al procesar el envío';
      res.status(400).json({ error: msg });
    }
  } catch (error) {    res.status(500).json({ error: 'Error interno del servidor al intentar conectar con Resend' });
  }
}
