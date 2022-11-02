class CardsController < ApplicationController
  before_action :authenticate_user!

  def edit
    @setup_intent = current_user.create_setup_intent
  end

  def update
    current_user.update_card(params[:payment_method_id])
    redirect_to subscription_path, notice: "Your card was successfully updated."
  rescue Stripe::StripeError => e
    #make this an alert
    redirect_to edit_card_path, notice: "Our payment processor returned the following error: #{e.message}"
  end
end
