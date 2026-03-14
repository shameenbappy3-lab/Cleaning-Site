/* ══════════════════════════════════════════════════════
   LUMIÈRE CLEAN — script.js
   Hero Slider | Scroll Animations | Counter | Forms
══════════════════════════════════════════════════════ */

"use strict";

/* ── DOM READY ─────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHeroSlider();
  initTestimonialSlider();
  initScrollReveal();
  initCounters();
  initFloatingButton();
  initBookingForm();
  initMailchimpForm();
  initMobileMenu();
  initBackToTop();
});

/* ══════════════════════════════════════════════════════
   1. NAVBAR — scroll behaviour
══════════════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll(); // run once on load
}

/* ══════════════════════════════════════════════════════
   2. HERO SLIDER
══════════════════════════════════════════════════════ */
function initHeroSlider() {
  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;
  const INTERVAL = 5500;

  function resetImage(slide) {
    const img = slide.querySelector(".slide-img");
    if (!img) return;
    img.style.transition = "none";
    img.style.transform = "scale(1.08)";
    void img.offsetWidth; // force reflow
    img.style.transition = "";
  }

  function next() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    resetImage(slides[current]);
    slides[current].classList.add("active");
  }

  setInterval(next, INTERVAL);
}

/* ══════════════════════════════════════════════════════
   3. TESTIMONIALS SLIDER
══════════════════════════════════════════════════════ */
function initTestimonialSlider() {
  const track   = document.getElementById("testiTrack");
  const prevBtn = document.getElementById("testiPrev");
  const nextBtn = document.getElementById("testiNext");
  if (!track) return;

  const cards     = Array.from(track.querySelectorAll(".testi-card"));
  const cardCount = cards.length;
  let current     = 0;
  const GAP       = 24; // 1.5rem in px

  const getVisible = () => {
    if (window.innerWidth < 768)  return 1;
    if (window.innerWidth < 1024) return 2;
    return 3;
  };

  // Force explicit card widths so JS and CSS agree
  function setCardWidths() {
    const visible   = getVisible();
    const container = track.parentElement.offsetWidth;
    const cardW     = (container - GAP * (visible - 1)) / visible;
    cards.forEach(c => {
      c.style.minWidth = cardW + "px";
      c.style.width    = cardW + "px";
    });
    return cardW;
  }

  function slideTo(index) {
    const cardW  = setCardWidths();
    const maxIdx = Math.max(0, cardCount - getVisible());
    current = Math.max(0, Math.min(index, maxIdx));
    track.style.transform = `translateX(-${current * (cardW + GAP)}px)`;
  }

  if (prevBtn) prevBtn.addEventListener("click", () => slideTo(current - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => slideTo(current + 1));

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => slideTo(0), 150);
  }, { passive: true });

  slideTo(0);
}

/* ══════════════════════════════════════════════════════
   4. SCROLL REVEAL — Intersection Observer
══════════════════════════════════════════════════════ */
function initScrollReveal() {
  const elements = document.querySelectorAll(
    ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right"
  );
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
  );

  elements.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════════
   5. ANIMATED COUNTERS
══════════════════════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const ease = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 2000; // ms
    const start    = performance.now();

    const tick = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value    = Math.round(ease(progress) * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((el) => observer.observe(el));
}

/* ══════════════════════════════════════════════════════
   6. FLOATING CALL BUTTON — show after scroll
══════════════════════════════════════════════════════ */
function initFloatingButton() {
  const btn = document.getElementById("floatCall");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 300) {
        btn.style.opacity = "1";
        btn.style.pointerEvents = "all";
      } else {
        btn.style.opacity = "0";
        btn.style.pointerEvents = "none";
      }
    },
    { passive: true }
  );

  // Initially hidden
  btn.style.opacity = "0";
  btn.style.transition = "opacity 0.4s ease";
  btn.style.pointerEvents = "none";
}

/* ══════════════════════════════════════════════════════
   7. BACK TO TOP BUTTON
══════════════════════════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;

  window.addEventListener(
    "scroll",
    () => {
      if (window.scrollY > 600) {
        btn.classList.add("visible");
      } else {
        btn.classList.remove("visible");
      }
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ══════════════════════════════════════════════════════
   8. BOOKING FORM — simple validation & submission
══════════════════════════════════════════════════════ */
function initBookingForm() {
  const form = document.getElementById("bookingForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type='submit']");
    const original = btn.innerHTML;

    btn.disabled = true;
    btn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Sending...`;

    // Simulate async submission (replace with your backend/Formspree/etc.)
    setTimeout(() => {
      btn.innerHTML = `<i class="fa-solid fa-check"></i> Quote Requested! We'll call you soon.`;
      btn.style.background = "#22c55e";
      btn.style.color = "#fff";

      setTimeout(() => {
        btn.disabled = false;
        btn.innerHTML = original;
        btn.style.background = "";
        btn.style.color = "";
        form.reset();
      }, 4000);
    }, 1500);
  });
}

/* ══════════════════════════════════════════════════════
   9. MAILCHIMP FORM — AJAX submission
   ─────────────────────────────────────────────────────
   HOW TO CONFIGURE:
   1. Go to Mailchimp → Audience → Signup Forms → Embedded Forms
   2. Copy your form action URL (contains your list ID & u= param)
   3. Paste it into the <form action="..."> in index.html
   4. Replace the bot-honeypot field name b_XXXX_XXXX with yours
══════════════════════════════════════════════════════ */
function initMailchimpForm() {
  const form = document.getElementById("mc-embedded-subscribe-form");
  const msg  = document.getElementById("form-msg");
  if (!form || !msg) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("mce-EMAIL").value.trim();
    const fname = document.getElementById("mce-FNAME").value.trim();

    if (!email || !validateEmail(email)) {
      showMsg(msg, "error", "Please enter a valid email address.");
      return;
    }

    const submitBtn = form.querySelector("#mc-embedded-subscribe");
    const original  = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...`;
    msg.className = "form-msg";
    msg.textContent = "";

    // Build JSONP URL from form action (Mailchimp requires JSONP for cross-origin)
    const actionUrl = form.action.replace("/post?", "/post-json?") + "&c=mcCallback";
    const params    = new URLSearchParams({
      EMAIL: email,
      FNAME: fname,
    });
    const jsonpUrl = `${actionUrl}&${params.toString()}`;

    // JSONP callback
    window.mcCallback = (data) => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;

      if (data.result === "success") {
        showMsg(msg, "success", "🎉 You're subscribed! Check your inbox.");
        form.reset();
      } else {
        // Mailchimp returns HTML in msg — strip tags
        const cleaned = stripTags(data.msg || "Something went wrong. Please try again.");
        showMsg(msg, "error", cleaned);
      }
      // Clean up script tag
      const old = document.getElementById("mc-jsonp");
      if (old) old.remove();
    };

    // Inject script tag for JSONP
    const script    = document.createElement("script");
    script.id       = "mc-jsonp";
    script.src      = jsonpUrl;
    script.onerror  = () => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
      showMsg(msg, "error", "Could not connect. Please try again later.");
      script.remove();
    };
    document.head.appendChild(script);

    // Timeout fallback (5s)
    setTimeout(() => {
      const s = document.getElementById("mc-jsonp");
      if (s) {
        s.remove();
        submitBtn.disabled = false;
        submitBtn.innerHTML = original;
        showMsg(
          msg,
          "error",
          "Request timed out. Please refresh and try again, or call us directly."
        );
      }
    }, 5000);
  });
}

/* ── HELPERS ───────────────────────────────────────── */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showMsg(el, type, text) {
  el.className = `form-msg ${type}`;
  el.textContent = text;
}

function stripTags(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

/* ══════════════════════════════════════════════════════
   10. MOBILE MENU
══════════════════════════════════════════════════════ */
function initMobileMenu() {
  const hamburger   = document.getElementById("hamburger");
  const mobileMenu  = document.getElementById("mobileMenu");
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  });
}

function closeMobileMenu() {
  const hamburger  = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  if (!mobileMenu) return;
  mobileMenu.classList.remove("open");
  if (hamburger) hamburger.classList.remove("open");
  document.body.style.overflow = "";
}

/* ══════════════════════════════════════════════════════
   11. SMOOTH ANCHOR SCROLL — offset for fixed navbar
══════════════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById("navbar")?.offsetHeight || 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: "smooth" });
  });
});