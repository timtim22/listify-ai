class PricingController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_admin

  def show
    @plans = Plan.where(interval: 'month')
  end
end
