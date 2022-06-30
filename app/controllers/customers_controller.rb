class CustomersController < ApplicationController
  before_action :authenticate_user!

  def edit
    @customer = Subscriptions::Customer.fetch(current_user)
  end

  def update
    begin
      Subscriptions::Customer.update(current_user, customer_params)
      redirect_to subscription_path, notice: 'Details successfully updated'
    rescue StandardError => e
      puts e
      redirect_to subscription_path, alert: 'An error occurred updating your details - please try again or contact us.'
    end
  end

  private

  def customer_params
    params.require(:customer).permit(:name, :line1, :line2, :city, :state, :country, :postal_code)
  end
end
