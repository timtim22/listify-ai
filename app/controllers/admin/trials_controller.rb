class Admin::TrialsController < ApplicationController
  def index
    @users = User.trial_states.includes(:subscriptions, :team, :team_role).order(created_at: :desc)
  end
end
