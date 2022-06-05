class Admin::SubscriptionsController < ApplicationController
  def index
    @q = Subscription.ransack(params[:q])

    @subscriptions =
      @q
      .result
      .includes(:user)
      .order(created_at: :desc)

    @pagy, @subscriptions = pagy(@subscriptions, items: 30)
  end
end
