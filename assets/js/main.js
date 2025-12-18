// =========================
// ANIMACIONES AOS
// =========================
document.addEventListener('DOMContentLoaded', () => {
  if (window.AOS) {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      offset: 120
    });
  } else {
    console.error('AOS no está cargado. Revisa la ruta de assets/vendor/aos/aos.js');
  }
});

// =========================
// SLIDER (Si usas Swiper)
// =========================
document.addEventListener('DOMContentLoaded', () => {
  if (typeof Swiper !== 'undefined') {
    new Swiper('.hero-swiper', {
      loop: true,
      speed: 800,
      autoplay: { delay: 4500, disableOnInteraction: false },
      effect: 'slide',
      pagination: { el: '.swiper-pagination', clickable: true },
      navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
      a11y: { enabled: true }
    });
  }
});

// =========================
// SCROLL SUAVE A SECCIÓN
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const scrollButton = document.querySelector('.scroll-btn');
  const targetSection = document.querySelector('#ing-servicios');

  if (scrollButton && targetSection) {
    scrollButton.addEventListener('click', (e) => {
      e.preventDefault();

      const navbarHeight = document.querySelector('header')?.offsetHeight || 0;
      const targetPosition = targetSection.getBoundingClientRect().top + window.scrollY - navbarHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  }
});

// =========================
// FORMULARIO + reCAPTCHA v3
// =========================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-contacto');
  if (!form) return;

  // --- Validación en tiempo real ---
  const inputs = form.querySelectorAll('input, textarea');
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      if (input.checkValidity()) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
      }
    });
  });

  // --- Envío con reCAPTCHA ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Validación HTML5
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    // Limpiar alertas
    form.querySelectorAll('.alert').forEach(a => a.remove());

    // Estado del botón
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Enviando...';

    try {
      // =====================================
      // Obtener TOKEN de reCAPTCHA v3
      // =====================================
      const token = await grecaptcha.execute("6LdyRxssAAAAAEvHMFtDtIFZ51G9QEqgPuAuud4c", { action: "submit" });

      const formData = new FormData(form);
      formData.append("recaptcha_token", token); // 👈 enviar token al backend

      const response = await fetch(form.action, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      // Mostrar alerta
      const alertBox = document.createElement('div');
      alertBox.className = `alert mt-3 text-center ${result.status === 'success' ? 'alert-success' : 'alert-danger'}`;
      alertBox.textContent = result.message;
      form.appendChild(alertBox);

      if (result.status === 'success') {
        form.reset();
        form.classList.remove('was-validated');
        form.querySelectorAll('.is-valid').forEach(el => el.classList.remove('is-valid'));
      }

      setTimeout(() => alertBox.remove(), 4000);

    } catch (error) {
      const alertBox = document.createElement('div');
      alertBox.className = 'alert alert-danger mt-3 text-center';
      alertBox.textContent = 'Error de conexión o respuesta no válida.';
      form.appendChild(alertBox);
      setTimeout(() => alertBox.remove(), 4000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalText;
    }
  });
});
