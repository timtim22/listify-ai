// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.

import Rails from "@rails/ujs"
import Turbolinks from "turbolinks"
import * as ActiveStorage from "@rails/activestorage"
import "channels"
require("stylesheets/application.scss")
require("helpers/requests")
require("helpers/utils")
require("helpers/translations")
require("helpers/listingBuilder")

Rails.start()
Turbolinks.start()
ActiveStorage.start()
// Support component names relative to this directory:
var componentRequireContext = require.context("components", true);
var ReactRailsUJS = require("react_ujs");
ReactRailsUJS.useContext(componentRequireContext);

document.addEventListener("turbolinks:load", () => {
  let cardElement = document.querySelector("#card-element");
  if (cardElement !== null) { setupStripe() }

  let newCard = document.querySelector("#use-new-card");
  if (newCard !== null) {
    newCard.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("#payment-form").classList.remove("hidden");
      document.querySelector("#existing-card").classList.add("hidden");
      const countrySelect = document.getElementById('user_country');
      if (countrySelect) { setVatNotice(countrySelect.value) }
    })
  }

  let existingCard = document.querySelector("#existing-card");
  if (existingCard !== null) {
    addLoadingStateToExistingCard(existingCard);
  }
})

function addLoadingStateToExistingCard(form) {
  form.addEventListener("submit", () => {
    event.preventDefault();
    setLoading(form);
    form.submit();
  })
}

function setupStripe() {
  const stripeKey = document.querySelector("meta[name='stripe-key']").getAttribute("content");
  const stripe = Stripe(stripeKey);
  const elements = stripe.elements({ locale: "en-GB" });
  const card = elements.create("card");
  card.mount("#card-element");

  var displayError = document.getElementById("card-errors");

  card.addEventListener("change", (event) => {
    if (event.error) {
      displayError.textContent = event.error.message;
    } else {
      displayError.textContent = "";
    }
  })

  const form = document.querySelector("#payment-form");

  let paymentIntentId = form.dataset.paymentIntent;
  let setupIntentId = form.dataset.setupIntent;

  if (paymentIntentId) {
    if (form.dataset.status == "requires_action") {
      stripe.confirmCardPayment(paymentIntentId, { setup_future_usage: "off_session" }).then((result) => {
        if (result.error) {
          displayError.textContent = result.error.message;
          form.querySelector("#card-details").classList.remove("hidden");
          clearLoading(form);
        } else {
          form.submit();
        }
      })
    }
  }

  form.addEventListener("submit", () => {
    event.preventDefault();
    setLoading(form);

    let name = form.querySelector("#name_on_card").value;
    let data = {
      payment_method_data: {
        card: card,
        billing_details: {
          name: name
        }
      }
    }

    //complete payment intent
    if (paymentIntentId) {
      stripe.confirmCardPayment(paymentIntentId, {
        payment_method: data.payment_method_data,
        setup_future_usage: "off_session",
        save_payment_method: true
      }).then((result) => {
        if (result.error) {
          displayError.textContent = result.error.message;
          form.querySelector("#card-details").classList.remove("hidden");
          clearLoading(form);
        } else {
          form.submit();
        }
      })
    // update card or subscribe with trial
    } else if (setupIntentId) {
      stripe.confirmCardSetup(setupIntentId, {
        payment_method: data.payment_method_data
      }).then((result) => {
        if (result.error) {
          displayError.textContent = result.error.message;
          clearLoading(form);
        } else {
          addHiddenField(form, "payment_method_id", result.setupIntent.payment_method);
          form.submit();
        }
      })
    } else {
    // subscribe with no trial
      data.payment_method_data.type = "card"
      stripe.createPaymentMethod(data.payment_method_data).then((result) => {
        if (result.error) {
          displayError.textContent = result.error.message;
          clearLoading(form);
        } else {
          addHiddenField(form, "payment_method_id", result.paymentMethod.id);
          form.submit();
        }
      })
    }
  })
}

function addHiddenField(form, name, value) {
  let hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", name);
  hiddenInput.setAttribute("value", value);
  form.appendChild(hiddenInput);
}

function setLoading(form) {
  form.querySelector("#submit-container").classList.add("hidden");
  form.querySelector("#submit-loading").classList.remove("hidden");
}

function clearLoading(form) {
  form.querySelector("#submit-container").classList.remove("hidden");
  form.querySelector("#submit-loading").classList.add("hidden");
}

// VAT notice

function setVatNotice(value) {
  const vatNotices = document.querySelectorAll('span.vat_notice');
  const cardVatNotice = document.getElementById('card_vat_notice');

  if (value === "GB") {
    vatNotices.forEach((notice) => {
      notice.innerText = " (plus UK VAT at 20%) ";
    });
    cardVatNotice.innerText = " (plus UK VAT at 20%) ";
  } else {
    vatNotices.forEach((notice) => {
      notice.innerText = "";
    });
    cardVatNotice.innerText = "";
  }
}

document.addEventListener("turbolinks:load", () => {
  const countrySelect = document.getElementById('user_country');
  if (countrySelect) {
    countrySelect.addEventListener('change', (event) => {
      setVatNotice(event.target.value);
    });
    setVatNotice(countrySelect.value);
  }
});
