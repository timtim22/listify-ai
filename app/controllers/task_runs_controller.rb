class TaskRunsController < ApplicationController
  before_action :authenticate_admin

  def index
    if params[:user]
      users = User.where(email: params[:user])
    elsif params[:admin]
      users = User.all
    else
      users = User.where.not(admin: true)
    end

    @task_runs = TaskRun
      .where(user: users)
      .includes(:user, :input_object, :prompt_set, :text_results, :task_results, task_results: [:content_filter_results, :translations])
      .order(created_at: :desc)

    @prompts = Prompt.all

    @pagy, @task_runs = pagy(@task_runs)
  end
end
