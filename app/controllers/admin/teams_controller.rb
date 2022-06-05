class Admin::TeamsController < ApplicationController
  def index
    @users = User.with_team.includes(:team, team_role: [:team]).order(created_at: :desc)
  end
end
