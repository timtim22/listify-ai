class Admin::TrialsController < ApplicationController
  before_action :authenticate_admin

  def index
    @q = User.trial_states.ransack(params[:q])
    @users = @q.result.includes(:subscriptions, :team, :team_role).order(created_at: :desc)

    @pagy, @users = pagy(@users, items: 30)
  end
end
