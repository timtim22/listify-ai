class Admin::SubscriptionsController < ApplicationController
  def index
    @subscriptions = Subscription.all.includes(:user)
  end
end
