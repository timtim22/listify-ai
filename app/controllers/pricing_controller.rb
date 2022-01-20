class PricingController < ApplicationController
  before_action :authenticate_user!

  def show
    @plans = Plan.where(interval: 'month')
  end
end
