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
})

function setupStripe() {
  const stripeKey = document.querySelector("meta[name='stripe-key']").getAttribute("content")
  const stripe = Stripe(stripeKey)
  const elements = stripe.elements()
  const card = elements.create("card")
  card.mount("#card-element")

  var displayError = document.getElementById("card-errors")

  card.addEventListener("change", (event) => {
    if (event.error) {
      displayError.textContent = event.error.message
    } else {
      displayError.textContent = ""
    }
  })

  const form = document.querySelector("#payment-form");
  form.addEventListener("submit", () => {
    event.preventDefault();

    let name = form.querySelector("#name_on_card").value
    let data = {
      payment_method_data: {
        card: card,
        billing_details: {
          name: name
        }
      }
    }

    //complete payment intent
    // update card or subscribe with trial
    // subscribe with no trial

    data.payment_method_data.type = "card"
    stripe.createPaymentMethod(data.payment_method_data).then((result) => {
      if (result.error) {
        displayError.textContent = result.error.message
      } else {
        addHiddenField(form, "payment_method_id", result.paymentMethod.id)
        form.submit()
      }
    })
  })
}

function addHiddenField(form, name, value) {
  let hiddenInput = document.createElement("input");
  hiddenInput.setAttribute("type", "hidden");
  hiddenInput.setAttribute("name", name);
  hiddenInput.setAttribute("value", value);
  form.appendChild(hiddenInput);
}
