(function () {
  "use strict";

  var CONFIG = window.SOAEG_CONTACT || {
    phone: "010-0000-0000",
    kakaoId: "준비중",
    telegramId: "준비중",
    pendingLabel: "준비중",
  };

  var CHANNEL = window.SOAEG_CHANNEL || { pluginKey: "" };

  var PENDING = CONFIG.pendingLabel || "준비중";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function getChannelPluginKey() {
    return String(CHANNEL.pluginKey || "").trim();
  }

  function isChannelTalkEnabled() {
    return getChannelPluginKey() !== "";
  }

  function isContactValueReady(value) {
    return Boolean(value && String(value).trim() !== "" && String(value).trim() !== PENDING);
  }

  function initChannelTalk() {
    if (!isChannelTalkEnabled() || !window.ChannelIO) {
      return;
    }

    ChannelIO("boot", {
      pluginKey: getChannelPluginKey(),
    });
  }

  function openChannelMessenger() {
    if (!window.ChannelIO) {
      return;
    }

    ChannelIO("showMessenger");
  }

  function openConsultation() {
    openChannelMessenger();
    closeMobileNavIfOpen();
  }

  function applyContactValues() {
    var fieldMap = {
      phone: CONFIG.phone,
      kakao: CONFIG.kakaoId,
      telegram: CONFIG.telegramId,
    };

    $all("[data-contact-value]").forEach(function (el) {
      var field = el.getAttribute("data-contact-value");
      var value = fieldMap[field];

      if (!value) {
        return;
      }

      el.textContent = value;

      if (field !== "phone") {
        el.classList.toggle("is-pending", !isContactValueReady(value));
      }
    });
  }

  applyContactValues();
  initChannelTalk();
  initHeroSlider();

  function initHeroSlider() {
    var slider = $("[data-hero-slider]");
    if (!slider) {
      return;
    }

    var slides = $all(".hero-slider__slide", slider);
    var dots = $all("[data-hero-dot]", slider);
    if (slides.length < 2) {
      return;
    }

    var current = 0;
    var intervalMs = 4500;
    var timer = null;

    function goTo(index) {
      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === current);
      });

      dots.forEach(function (dot, i) {
        var isActive = i === current;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-selected", isActive ? "true" : "false");
      });
    }

    function startAuto() {
      if (timer) {
        clearInterval(timer);
      }

      timer = setInterval(function () {
        goTo(current + 1);
      }, intervalMs);
    }

    dots.forEach(function (dot) {
      dot.addEventListener("click", function () {
        goTo(Number(dot.getAttribute("data-hero-dot")));
        startAuto();
      });
    });

    goTo(0);
    startAuto();
  }

  var menuToggle = $("[data-menu-toggle]");
  var mobileNav = $("[data-mobile-nav]");

  function closeMobileNavIfOpen() {
    if (mobileNav && mobileNav.classList.contains("is-open")) {
      mobileNav.classList.remove("is-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
      }
    }
  }

  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", function () {
      var isOpen = mobileNav.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });

    $all("a", mobileNav).forEach(function (link) {
      link.addEventListener("click", function () {
        if (link.hasAttribute("data-contact-modal")) {
          return;
        }
        mobileNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
      });
    });
  }

  $all("[data-contact-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openConsultation();
    });
  });

  var header = $(".site-header");

  if (header) {
    var ticking = false;

    function updateHeaderShadow() {
      header.classList.toggle("is-scrolled", window.scrollY > 4);
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          window.requestAnimationFrame(updateHeaderShadow);
          ticking = true;
        }
      },
      { passive: true }
    );

    updateHeaderShadow();
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && mobileNav && mobileNav.classList.contains("is-open")) {
      mobileNav.classList.remove("is-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
        menuToggle.focus();
      }
    }
  });

  if (window.location.hash === "#open-contact") {
    openConsultation();
  }
})();
