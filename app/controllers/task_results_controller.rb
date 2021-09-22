class TaskResultsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_task_run

  def index
    @task_results = @task_run.task_results
  end

  private

  def set_task_run
    @task_run = TaskRun.find(params[:task_run_id])
  end
end
