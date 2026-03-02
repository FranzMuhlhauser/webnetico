/**
 * Webnetico — contact-form.js
 * Handles the contact form submission
 *
 * ⚠️ IMPORTANTE: Este archivo ha sido actualizado por安全问题
 * La lógica de envío de correo ha sido movida a un backend seguro.
 *
 * Opciones seguras para el envío de formularios:
 * 1. Netlify Forms (recomendado para sitios estáticos)
 * 2. Formspree (servicio externo)
 * 3. Cloudflare Workers / Netlify Functions (backend personalizado)
 *
 * Para configurar Netlify Forms:
 * 1. Agregar el atributo "data-netlify="true"" al formulario
 * 2. Eliminar este JavaScript y dejar que Netlify maneje el envío
 *
 * Para configurar Formspree:
 * 1. Registrarse en formspree.io
 * 2. Crear un formulario y obtener el endpoint
 * 3. Actualizar la URL del fetch hacia el endpoint de Formspree
 */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  if (!form) return;

  // Configuración del formulario
  // NOTA: Reemplazar con tu endpoint de Formspree o Netlify Forms
  const FORMSPREE_ENDPOINT = "https://formspree.io/f/TU_FORM_ID";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const name = formData.get("name");
    const email = formData.get("email");
    const subject = formData.get("subject") || "Sin especificar";
    const urgency = formData.get("urgency");
    const message = formData.get("message");

    // Validación del lado del cliente
    if (!name || !email || !message) {
      if (window.showToast) {
        window.showToast(
          "Por favor, complete todos los campos requeridos.",
          "error",
        );
      }
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      if (window.showToast) {
        window.showToast("Por favor, ingrese un email válido.", "error");
      }
      return;
    }

    try {
      if (window.showToast) window.showToast("Enviando mensaje...", "success");

      // Llamada a nuestra API en Vercel que usa Resend
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          urgency,
          message,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (window.showToast) {
          window.showToast(
            "¡Solicitud enviada con éxito! Nos contactaremos pronto.",
            "success",
          );
        }
        form.reset();

        // Restablecer selección de plan
        document
          .querySelectorAll(".plan-option-btn")
          .forEach((b) => b.classList.remove("selected"));
        const defaultPlan = document.querySelector(
          '.plan-option-btn[data-plan="Landing Page"]',
        );
        if (defaultPlan) defaultPlan.classList.add("selected");
        const subjectInput = document.getElementById("subject");
        if (subjectInput) subjectInput.value = "Landing Page";
      } else {
        throw new Error(data.error || "Error en el servidor");
      }
    } catch (err) {
      console.error("Form Error:", err);

      // Mensaje de error más seguro - no expone detalles técnicos
      if (window.showToast) {
        window.showToast(
          "Error al enviar. Por favor, contáctenos por WhatsApp.",
          "error",
        );
      }
    }
  });

  // Validación en tiempo real
  const emailInput = document.getElementById("email");
  if (emailInput) {
    emailInput.addEventListener("blur", function () {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (this.value && !emailRegex.test(this.value)) {
        this.setCustomValidity("Por favor, ingrese un email válido");
        this.reportValidity();
      } else {
        this.setCustomValidity("");
      }
    });
  }
});

/**
 * Alternativa: Usar Netlify Forms (la forma más recomendada)
 *
 * 1. En el HTML del formulario, agregar:
 *    <form name="contact" method="POST" data-netlify="true" action="/success/">
 *
 * 2. Eliminar todo el JavaScript de arriba
 *
 * 3. Netlify procesará el formulario automáticamente
 *
 * Ventajas:
 * - Sin costo adicional (incluido en Netlify)
 * - Sin exposición de API keys
 * - Soporte para archivos adjuntos
 * - Notificaciones por email
 * - Panel de administración
 */
