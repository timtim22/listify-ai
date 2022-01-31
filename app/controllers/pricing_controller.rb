class PricingController < ApplicationController
  before_action :authenticate_user!

  def show
    @plans = Plan.public
  end
end
