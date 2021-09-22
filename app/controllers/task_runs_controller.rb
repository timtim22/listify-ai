class TaskRunsController < ApplicationController
  before_action :authenticate_admin

  def index
    if params[:user]
      users = User.where(email: params[:user])
    else
      users = User.all
    end

    @task_runs = TaskRun
      .where(user: users)
      .includes(:user, :input_object, :prompt_set, :task_results, task_results: :content_filter_results)
      .order(created_at: :desc)

    @pagy, @task_runs = pagy(@task_runs)
  end
end
