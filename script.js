(function () {
  var KLAVIYO_PUBLIC_KEY = "SXBN7k";
  var LIST_WAITLIST = "QTWbQm";
  var LIST_DEPOSIT = "WS6cXL";

  // TODO: replace with your real Stripe Payment Link for the $5 deposit.
  // Create one at https://dashboard.stripe.com/payment-links (one-time price, $5.00).
  var STRIPE_PAYMENT_LINK = "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK";

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
  var step2 = document.getElementById("step2");
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
          step1Form.hidden = true;
          step2.hidden = false;
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

  var skipLink = document.getElementById("skip-link");
  if (skipLink) {
    skipLink.addEventListener("click", function (e) {
      e.preventDefault();
      step2.hidden = true;
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
