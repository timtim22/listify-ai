class PricingController < ApplicationController

  def show
    @plans = Plan.public
  end
end
