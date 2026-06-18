(function () {
  "use strict";

  var CONFIG = window.SOAEG_CONTACT || {
    phone: "010-0000-0000",
    kakaoId: "준비중",
    telegramId: "준비중",
    pendingLabel: "준비중",
  };

  var PENDING = CONFIG.pendingLabel || "준비중";

  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  function phoneToTel(phone) {
    return "tel:" + String(phone).replace(/\D/g, "");
  }

  function isChannelReady(value) {
    return Boolean(value && String(value).trim() !== "" && String(value).trim() !== PENDING);
  }

  function resolveChannelUrl(channel, value) {
    var trimmed = String(value).trim();

    if (trimmed.indexOf("http://") === 0 || trimmed.indexOf("https://") === 0) {
      return trimmed;
    }

    if (channel === "telegram") {
      var handle = trimmed.replace(/^@/, "");
      return "https://t.me/" + handle;
    }

    if (channel === "kakao") {
      return trimmed;
    }

    return "";
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

      if (field === "phone") {
        el.classList.remove("contact-modal__value--pending");
        return;
      }

      el.classList.toggle("contact-modal__value--pending", !isChannelReady(value));
    });

    $all("[data-contact-tel]").forEach(function (link) {
      link.setAttribute("href", phoneToTel(CONFIG.phone));
    });
  }

  function setupChannelButtons() {
    var channels = [
      { key: "kakao", configKey: "kakaoId", selector: "[data-contact-channel='kakao']" },
      { key: "telegram", configKey: "telegramId", selector: "[data-contact-channel='telegram']" },
    ];

    channels.forEach(function (channel) {
      var value = CONFIG[channel.configKey];
      var ready = isChannelReady(value);

      $all(channel.selector).forEach(function (btn) {
        btn.disabled = !ready;
        btn.classList.toggle("is-disabled", !ready);
        btn.setAttribute("aria-disabled", ready ? "false" : "true");

        if (!ready) {
          return;
        }

        btn.addEventListener("click", function () {
          var url = resolveChannelUrl(channel.key, value);

          if (url.indexOf("http") === 0) {
            window.open(url, "_blank", "noopener,noreferrer");
            return;
          }

          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(value);
          }
        });
      });
    });
  }

  applyContactValues();
  setupChannelButtons();

  var menuToggle = $("[data-menu-toggle]");
  var mobileNav = $("[data-mobile-nav]");

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

  var contactModal = $("#contactModal");
  var lastFocusedElement = null;

  function openContactModal() {
    if (!contactModal) {
      return;
    }

    lastFocusedElement = document.activeElement;
    contactModal.hidden = false;
    contactModal.setAttribute("aria-hidden", "false");
    contactModal.classList.add("is-open");
    document.body.classList.add("modal-open");

    var dialog = $(".contact-modal__dialog", contactModal);
    if (dialog) {
      dialog.focus();
    }

    if (mobileNav && mobileNav.classList.contains("is-open")) {
      mobileNav.classList.remove("is-open");
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "메뉴 열기");
      }
    }
  }

  function closeContactModal() {
    if (!contactModal || contactModal.hidden) {
      return;
    }

    contactModal.classList.remove("is-open");
    contactModal.hidden = true;
    contactModal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  $all("[data-contact-modal]").forEach(function (trigger) {
    trigger.addEventListener("click", function (event) {
      event.preventDefault();
      openContactModal();
    });
  });

  if (contactModal) {
    $all("[data-contact-close]", contactModal).forEach(function (el) {
      el.addEventListener("click", function () {
        closeContactModal();
      });
    });
  }

  $all("[data-call]").forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      if (!confirm("전화 상담 " + CONFIG.phone + " 으로 연결하시겠습니까?")) {
        event.preventDefault();
      }
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
    if (event.key === "Escape") {
      if (contactModal && contactModal.classList.contains("is-open")) {
        closeContactModal();
        return;
      }

      if (mobileNav && mobileNav.classList.contains("is-open")) {
        mobileNav.classList.remove("is-open");
        if (menuToggle) {
          menuToggle.setAttribute("aria-expanded", "false");
          menuToggle.setAttribute("aria-label", "메뉴 열기");
          menuToggle.focus();
        }
      }
    }
  });

  if (window.location.hash === "#open-contact") {
    openContactModal();
  }
})();
