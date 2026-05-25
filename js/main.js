// Performance: Use passive listeners for better scrolling performance
window.dataLayer = window.dataLayer || [];
const PHONE_NUMBER = "56994838304";

function trackEvent(eventName, payload = {}) {
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
        window.dataLayer.push(Object.assign({ event: eventName }, payload));
    }
}

// Critical: Load components immediately
document.addEventListener("DOMContentLoaded", async () => {
    // CRITICAL: Init reveal immediately for FCP (above-the-fold animations)
    initScrollReveal();
    
    // DEFER: Non-critical init to idle periods to reduce main thread blocking
    const deferredInits = [
        () => initDynamicHeader(),
        () => initMobileMenu(),
        () => highlightActiveLink()
    ];
    
    let taskIndex = 0;
    const scheduleIdleTask = () => {
        if (taskIndex >= deferredInits.length) return;
        
        if ("requestIdleCallback" in window) {
            requestIdleCallback(() => {
                deferredInits[taskIndex++]();
                scheduleIdleTask();
            }, { timeout: 100 });
        } else {
            setTimeout(() => {
                deferredInits[taskIndex++]();
                scheduleIdleTask();
            }, 50);
        }
    };
    
    scheduleIdleTask();

    if ("requestIdleCallback" in window) {
        requestIdleCallback(initNonCriticalFeatures, { timeout: 200 });
    } else {
        setTimeout(initNonCriticalFeatures, 200);
    }
});

/**
 * Scroll Reveal Animation logic
 */
function initScrollReveal() {
    const reveals = document.querySelectorAll('[reveal-on-scroll]');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // stop observing once revealed for performance
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    });

    reveals.forEach(el => revealObserver.observe(el));

    // Safety fallback: reveal everything after 3 seconds if JS/Observer fails
    setTimeout(() => {
        reveals.forEach(el => el.classList.add('is-visible'));
    }, 3000);
}

/**
 * Dynamic Header Theme logic
 * Toggles .theme-dark on header when over dark sections
 * Optimized: Default is light theme to prevent flash on page load
 */
function initDynamicHeader() {
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section');
    if (!header || !sections.length) return;

    const updateHeader = () => {
        let activeSection = null;
        const headerHeight = header.offsetHeight || 60;
        const checkY = headerHeight / 2;

        // Batch all DOM reads first
        const sectionRects = Array.from(sections).map(s => ({
            element: s,
            rect: s.getBoundingClientRect()
        }));

        // Process reads without additional DOM access
        for (const { element, rect } of sectionRects) {
            if (rect.top <= checkY && rect.bottom > checkY) {
                activeSection = element;
                break;
            }
        }

        // Single DOM write operation
        // Default is light, only add theme-dark for dark sections
        const isDark = activeSection && 
                       activeSection.classList.contains('theme-dark');

        if (isDark) {
            header.classList.add('theme-dark');
        } else {
            header.classList.remove('theme-dark');
        }
    };

    // Export to global scope for the component loader to use
    window.updateHeaderGlobal = updateHeader;

    // Initial evaluation (runs immediately to set correct state)
    updateHeader();

    window.addEventListener('load', updateHeader);

    // Throttled scroll/resize updates (~30fps max)
    let lastScrollTime = 0;
    const SCROLL_THROTTLE = 33;

    const requestUpdate = () => {
        const now = performance.now();
        if (now - lastScrollTime < SCROLL_THROTTLE) return;
        lastScrollTime = now;
        window.requestAnimationFrame(updateHeader);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
}

function initNonCriticalFeatures() {
  if (document.getElementById('whatsapp-btn')) initWhatsAppDrawer();
  if (document.getElementById('faq-list')) initFAQ();
  if (document.querySelector('.plan-option-btn')) initPlanSelector();
  initSiteTracking();
}

function initSiteTracking() {
  const trackedElements = document.querySelectorAll(
    'a.btn-cta-lg, a[href*="contact.html"], a[href*="services.html"], button.wa-option-btn, button.plan-option-btn'
  );

  trackedElements.forEach((element) => {
    element.addEventListener(
      'click',
      () => {
        trackEvent('site_cta_click', {
          label: element.textContent.trim().slice(0, 64),
          href: element.getAttribute('href') || null,
        });
      },
      { passive: true }
    );
  });

  const whatsappLink = document.getElementById('wa-send-link');
  if (whatsappLink) {
    whatsappLink.addEventListener('click', () =>
      trackEvent('whatsapp_lead', { label: 'WhatsApp Drawer' })
    );
  }
}

/**
 * Highlights the active link in the navigation based on the current URL
 */
function highlightActiveLink() {
  // Performance: Use event delegation instead of looping
  const nav = document.getElementById("nav-links");
  if (!nav) return;

  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  nav.querySelectorAll("a").forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === currentPath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ==============================
   MOBILE MENU
   ============================== */
function initMobileMenu() {
  const btn = document.getElementById("mobile-menu-btn");
  const nav = document.getElementById("nav-links");
  if (!btn || !nav) return;

  const iconMenu = btn.querySelector(".icon-menu");
  const iconClose = btn.querySelector(".icon-close");

  // Performance: Use passive listener for better scroll performance
  const toggleMenu = (e) => {
    e.preventDefault();
    const isOpen = nav.classList.toggle("mobile-open");
    btn.setAttribute("aria-expanded", isOpen);
    if (iconMenu) iconMenu.style.display = isOpen ? "none" : "";
    if (iconClose) iconClose.style.display = isOpen ? "" : "none";
  };

  btn.addEventListener("click", toggleMenu, { passive: false });

  // Close menu when clicking a link - use event delegation
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") {
      nav.classList.remove("mobile-open");
      btn.setAttribute("aria-expanded", "false");
      if (iconMenu) iconMenu.style.display = "";
      if (iconClose) iconClose.style.display = "none";
    }
  });

  // Close on escape key for accessibility
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("mobile-open")) {
      nav.classList.remove("mobile-open");
      btn.setAttribute("aria-expanded", "false");
      btn.focus();
    }
  });
}

/* ==============================
   FAQ ACCORDION
   ============================== */
function initFAQ() {
  const faqList = document.getElementById("faq-list");
  if (!faqList) return;

  // Performance: Use event delegation instead of adding listeners to each item
  faqList.addEventListener("click", (e) => {
    const header = e.target.closest(".faq-header");
    if (!header) return;

    const item = header.closest(".faq-item");
    const wasOpen = item.classList.contains("open");

    // Close all items
    faqList.querySelectorAll(".faq-item.open").forEach((i) => {
      i.classList.remove("open");
      i.querySelector(".faq-header").setAttribute("aria-expanded", "false");
    });

    // Toggle current
    if (!wasOpen) {
      item.classList.add("open");
      header.setAttribute("aria-expanded", "true");
    }
  });
}

/* ==============================
   WHATSAPP DRAWER
   ============================== */
function initWhatsAppDrawer() {
  const waBtn = document.getElementById("whatsapp-btn");
  const waDrawer = document.getElementById("wa-drawer");
  const waOverlay = document.getElementById("wa-overlay");
  const waClose = document.getElementById("wa-drawer-close");

  if (!waBtn || !waDrawer) return;

  const PHONE = PHONE_NUMBER;

  // State
  let state = {
    step: 1,
    name: "",
    category: "",
    plan: "",
  };

  const steps = {
    1: document.getElementById("wa-step-1"),
    2: document.getElementById("wa-step-2"),
    3: document.getElementById("wa-step-3"),
    4: document.getElementById("wa-step-4"),
  };

  function showStep(n) {
    Object.values(steps).forEach((s) => {
      if (s) s.classList.add("wa-hidden");
    });
    if (steps[n]) steps[n].classList.remove("wa-hidden");
    state.step = n;
  }

  function openDrawer() {
    waDrawer.classList.remove("wa-hidden");
    if (waOverlay) waOverlay.classList.remove("wa-hidden");
  }

  function closeDrawer() {
    waDrawer.classList.add("wa-hidden");
    if (waOverlay) waOverlay.classList.add("wa-hidden");
    // Reset
    state = { step: 1, name: "", category: "", plan: "" };
    const nameInput = document.getElementById("wa-name");
    if (nameInput) nameInput.value = "";
    showStep(1);
    updateContinueBtn();
  }

  function updateContinueBtn() {
    const continueBtn = document.getElementById("wa-continue-1");
    if (continueBtn) {
      continueBtn.disabled = state.name.trim() === "";
    }
  }

  function buildWaURL() {
    let msg = `Hola, mi nombre es ${state.name}.`;
    if (state.category === "Web") {
      msg += ` Me gustaría información sobre el Plan Web: ${state.plan}`;
    } else if (state.category === "Mantenimiento") {
      msg += ` Me gustaría información sobre el Plan de Mantenimiento: ${state.plan}`;
    } else if (state.category === "Otro") {
      msg += ` Me gustaría consultar por otros servicios.`;
    }
    return `https://wa.me/${PHONE}?text=${encodeURIComponent(msg)}`;
  }

  function renderPlans() {
    const list = document.getElementById("wa-plans-list");
    if (!list) return;
    list.innerHTML = "";

    const plans =
      state.category === "Web"
        ? ["Web Express", "Landing Page", "Multipágina"]
        : ["Soporte Vital", "Crecimiento Pro", "Alianza Elite"];

    plans.forEach((plan) => {
      const btn = document.createElement("button");
      btn.className = "wa-option-btn";
      btn.textContent = plan;
      btn.addEventListener("click", () => {
        state.plan = plan;
        showStep(4);
        const sendLink = document.getElementById("wa-send-link");
        if (sendLink) sendLink.href = buildWaURL();
      });
      list.appendChild(btn);
    });
  }

  // Event: Toggle drawer button
  waBtn.addEventListener("click", () => {
    if (waDrawer.classList.contains("wa-hidden")) {
      openDrawer();
    } else {
      closeDrawer();
    }
  });

  // Event: Close button
  if (waClose) waClose.addEventListener("click", closeDrawer);
  if (waOverlay) waOverlay.addEventListener("click", closeDrawer);

  // Event: Name input
  const nameInput = document.getElementById("wa-name");
  if (nameInput) {
    nameInput.addEventListener("input", (e) => {
      state.name = e.target.value;
      updateContinueBtn();
    });
  }

  // Event: Continue from step 1
  const continueBtn = document.getElementById("wa-continue-1");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      if (state.name.trim()) {
        const greeting = document.getElementById("wa-greeting-2");
        if (greeting)
          greeting.textContent = `Gusto en saludarte ${state.name}. ¿En qué podemos ayudarte hoy?`;
        showStep(2);
      }
    });
  }

  // Event: Category selection (step 2)
  const step2 = document.getElementById("wa-step-2");
  if (step2) {
    step2.querySelectorAll("[data-category]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.category = btn.dataset.category;
        if (state.category === "Otro") {
          state.plan = "Otro servicio";
          showStep(4);
          const sendLink = document.getElementById("wa-send-link");
          if (sendLink) sendLink.href = buildWaURL();
        } else {
          renderPlans();
          showStep(3);
        }
      });
    });
  }

  // Event: Back buttons
  const back2 = document.getElementById("wa-back-2");
  if (back2) back2.addEventListener("click", () => showStep(1));

  const back3 = document.getElementById("wa-back-3");
  if (back3) back3.addEventListener("click", () => showStep(2));

  const back4 = document.getElementById("wa-back-4");
  if (back4) {
    back4.addEventListener("click", () => {
      if (state.category === "Otro") {
        showStep(2);
      } else {
        showStep(3);
      }
    });
  }

  // Event: Send link click — close drawer
  const sendLink = document.getElementById("wa-send-link");
  if (sendLink) {
    sendLink.addEventListener("click", () => {
      setTimeout(closeDrawer, 300);
    });
  }
}

/**
 * Global Toast Notification System
 * @param {string} message - The message to display
 * @param {'success' | 'error'} type - The type of notification
 */
window.showToast = function (message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;

  // Container for toasts if it doesn't exist
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.style.cssText =
      "position: fixed; top: 100px; right: 20px; z-index: 10001; display: flex; flex-direction: column; gap: 10px;";
    document.body.appendChild(container);
  }

  container.appendChild(toast);

  // Auto-remove after animation
  setTimeout(() => {
    toast.remove();
    if (container.children.length === 0) {
      container.remove();
    }
  }, 4000);
};

/* ==============================
   PLAN SELECTOR (Contact Page)
   ============================== */
function initPlanSelector() {
  const planBtns = document.querySelectorAll(".plan-option-btn");
  const subjectInput = document.getElementById("subject");
  if (!planBtns.length || !subjectInput) return;

  planBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove selected from all
      planBtns.forEach((b) => b.classList.remove("selected"));
      // Add selected to clicked
      btn.classList.add("selected");
      // Update hidden input
      subjectInput.value = btn.dataset.plan;
    });
  });
}
