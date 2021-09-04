class TaskRunsController < ApplicationController
  before_action :authenticate_admin

  def index
    @task_runs = TaskRun
      .all
      .includes(:input_object, :prompt_set, :task_results)
      .order(created_at: :desc)
  end
end
