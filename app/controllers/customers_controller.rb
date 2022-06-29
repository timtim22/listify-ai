class CustomersController < ApplicationController
  before_action :authenticate_user!

  def edit
    @customer = Subscriptions::Customer.editable_stripe_customer(current_user)
    #binding.pry
  end

  def update
    Subscriptions::Customer.update(current_user, customer_params)
    redirect_to subscription_path, notice: 'Details successfully updated'
  end

  private

  def customer_params
    params.require(:customer).permit(:name, :line1, :line2, :city, :state, :country, :postal_code)
  end
end
