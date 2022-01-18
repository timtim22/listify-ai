class Admin::StatisticsController < ApplicationController
  before_action :authenticate_admin

  def index
    @users = User.all.includes(:task_runs)
  end
end
