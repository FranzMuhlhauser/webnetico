const escapeHtml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

export default async function handler(req, res) {
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

  if (!RESEND_API_KEY) {
    return res.status(500).json({ 
      error: 'Error de configuración', 
      message: 'La variable RESEND_API_KEY no se encuentra en Vercel. Debes agregarla en Settings > Environment Variables y hacer REDEPLOY.' 
    });
  }

  try {
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

    const data = await response.json();

    if (response.ok) {
      res.status(200).json({ success: true });
    } else {      res.status(400).json({ error: data.message || 'Error de Resend al procesar el envío' });
    }
  } catch (error) {    res.status(500).json({ error: 'Error interno del servidor al intentar conectar con Resend' });
  }
}
