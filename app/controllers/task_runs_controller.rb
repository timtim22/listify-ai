class TaskRunsController < ApplicationController
  before_action :authenticate_admin

  def index
    @task_runs = TaskRun
      .all
      .includes(:user, :input_object, :prompt_set, :task_results)
      .order(created_at: :desc)

    @pagy, @task_runs = pagy(@task_runs)
  end
end
