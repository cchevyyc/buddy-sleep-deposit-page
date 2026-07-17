(function () {
  var KLAVIYO_PUBLIC_KEY = "SXBN7k";
  var LIST_WAITLIST = "QTWbQm";
  var LIST_DEPOSIT = "WS6cXL";

  var STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJefZg0CdgUxatobkcf3a00";

  function subscribeToList(email, listId) {
    return fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + KLAVIYO_PUBLIC_KEY, {
      method: "POST",
      headers: { "Content-Type": "application/json", revision: "2024-10-15" },
      body: JSON.stringify({
        data: {
          type: "subscription",
          attributes: {
            profile: { data: { type: "profile", attributes: { email: email } } },
          },
          relationships: {
            list: { data: { type: "list", id: listId } },
          },
        },
      }),
    });
  }

  var storedEmail = null;

  var step1Form = document.getElementById("step1-form");
  var step1Content = document.getElementById("step1-content");
  var step2 = document.getElementById("step2");
  var heroScrim = document.getElementById("hero-scrim");
  var errorEl = document.getElementById("form-error");

  if (step1Form) {
    step1Form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("email-input").value.trim();
      if (!email) return;
      storedEmail = email;
      errorEl.hidden = true;
      subscribeToList(email, LIST_WAITLIST)
        .then(function () {
          step1Content.hidden = true;
          step2.hidden = false;
          if (heroScrim) heroScrim.classList.add("hero__scrim--step2");
        })
        .catch(function () {
          errorEl.textContent = "Something went wrong, please try again.";
          errorEl.hidden = false;
        });
    });
  }

  function goToDeposit() {
    var url = STRIPE_PAYMENT_LINK;
    if (storedEmail) {
      // Pre-fill email on Stripe's hosted checkout and tag the redirect
      url += (url.indexOf("?") === -1 ? "?" : "&") + "prefilled_email=" + encodeURIComponent(storedEmail);
      subscribeToList(storedEmail, LIST_DEPOSIT).catch(function () {});
    }
    window.location.href = url;
  }

  var depositBtn = document.getElementById("deposit-btn");
  if (depositBtn) depositBtn.addEventListener("click", goToDeposit);

  document.querySelectorAll("[data-deposit-trigger]").forEach(function (btn) {
    btn.addEventListener("click", goToDeposit);
  });

  if (window.IntersectionObserver && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var revealTargets = document.querySelectorAll("#page > section:not(.hero), #page > .featured, #page > .footer");
    var revealIO = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealIO.observe(el);
    });
  }

  var siteNav = document.querySelector(".site-nav");
  var heroEl = document.getElementById("hero");
  if (siteNav && heroEl) {
    var updateNav = function () {
      var pastHero = window.scrollY > heroEl.offsetHeight - 80;
      siteNav.classList.toggle("site-nav--dark", pastHero);
    };
    window.addEventListener("scroll", updateNav, { passive: true });
    updateNav();
  }

  var topbarCta = document.getElementById("topbar-cta");
  if (topbarCta) {
    topbarCta.addEventListener("click", function (e) {
      if (step1Content && !step1Content.hidden) {
        e.preventDefault();
        document.getElementById("email-input").focus();
      }
    });
  }

  var footerForm = document.getElementById("footer-form");
  if (footerForm) {
    footerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = document.getElementById("footer-email").value.trim();
      if (!email) return;
      subscribeToList(email, LIST_WAITLIST).then(function () {
        footerForm.hidden = true;
        document.getElementById("footer-msg").hidden = false;
      });
    });
  }
})();
