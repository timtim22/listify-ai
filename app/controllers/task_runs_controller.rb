class TaskRunsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :authenticate_admin, except: [:create]

  def index
    @task_runs = TaskRun.all.where.not(task_type: 'transcription').order(created_at: :desc).includes(:prompt)
  end

  def show
    @task_run = TaskRun.find(params[:id])
  end

  def create
    check_token

     @task_run = TaskRunner.run_for!(
        params[:text],
        params[:blob],
        params[:task_type]
      )

    respond_to do |format|
      if true
        format.json { render status: :ok }
      end
    end

  end
end
