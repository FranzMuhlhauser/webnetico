export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Solo POST permitido' });
  }

  const { name, email, subject, urgency, message } = req.body;

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
        subject: `Lead Webnético: ${subject || 'Consulta'} ${urgency ? `(${urgency})` : ''}`,
        reply_to: email, // Permite responder directamente al cliente
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
            <h2 style="color: #22c55e;">🆕 Nuevo Lead - Webnético.cl</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p><strong>Asunto:</strong> ${subject || 'No especificado'}</p>
            <p><strong>Urgencia:</strong> ${urgency || 'No especificada'}</p>
            <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-top: 20px;">
              <strong>Mensaje:</strong><br>
              <p style="white-space: pre-wrap;">${message}</p>
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
    } else {
      console.error('Resend Error Details:', data);
      res.status(400).json({ error: data.message || 'Error de Resend al procesar el envío' });
    }
  } catch (error) {
    console.error('Resend Exception:', error);
    res.status(500).json({ error: 'Error interno del servidor al intentar conectar con Resend' });
  }
}
