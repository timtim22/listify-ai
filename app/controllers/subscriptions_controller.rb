class SubscriptionsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_plan, only: [:new, :create, :update]

  def show
    @subscription = current_user.subscription
    @plan = @subscription && Plan.find_by(stripe_id: @subscription.stripe_plan)
    @customer = Subscriptions::Customer.fetch(current_user)
  end

  def new
  end

  def create
    current_user.update_card(params[:payment_method_id]) if params[:payment_method_id]
    current_user.subscribe(@plan.stripe_id, country_options)
    redirect_to root_path, notice: "Thanks for subscribing!"
  rescue PaymentIncomplete => e
    redirect_to payment_path(e.payment_intent.id)
  end

  def edit
    @subscription = current_user.subscription
    @plans = Plan.public
  end

  def update
    @subscription = current_user.subscription
    @subscription.swap(@plan.stripe_id)
    redirect_to subscription_path, notice: "You have successfully changed plans."
  end

  def destroy
    current_user.subscription.cancel
    redirect_to subscription_path, notice: "Your subscription has been cancelled."
  end

  def resume
    current_user.subscription.resume
    redirect_to subscription_path, notice: "Your subscription has been resumed."
  end

  private

  def country_options
    country_code = params.dig(:user, :country)
    current_user.update!(country_code: country_code) if country_code.present?
    if country_code == 'GB' || (country_code.nil? && current_user.country_code == 'GB')
      { automatic_tax: { enabled: true } }
    else
      {}
    end
  end

  def set_plan
    @plan = Plan.find_by(id: params[:plan_id])
    redirect_to pricing_path if @plan.nil?
  end
end
