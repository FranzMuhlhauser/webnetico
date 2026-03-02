
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, urgency, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = process.env.FROM_EMAIL || 'Webnetico <onboarding@resend.dev>';
  const TO_EMAIL = process.env.TO_EMAIL || 'hola@webnetico.cl';

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY is not defined');
    return res.status(500).json({ error: 'Error de configuración en el servidor' });
  }

  try {
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        subject: `Nuevo mensaje de contacto: ${subject}`,
        reply_to: email,
        html: `
          <h2>Nuevo mensaje de contacto desde la web</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Asunto:</strong> ${subject}</p>
          <p><strong>Urgencia:</strong> ${urgency}</p>
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap;">${message}</p>
          <hr>
          <p><em>Este mensaje fue enviado automáticamente desde el formulario de webnetico.cl</em></p>
        `,
      }),
    });

    const data = await resendResponse.json();

    if (resendResponse.ok) {
      return res.status(200).json({ success: true, id: data.id });
    } else {
      console.error('Resend API Error:', data);
      // Incluimos más detalle para depuración del usuario
      return res.status(resendResponse.status).json({ 
        error: `Error de Resend: ${data.message || 'Fallo desconocido'}`,
        details: data 
      });
    }
  } catch (error) {
    console.error('Serverless Function Error:', error);
    return res.status(500).json({ 
      error: 'Error interno del servidor', 
      message: error.message 
    });
  }
}
