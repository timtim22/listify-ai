class LegacyTaskRunsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :authenticate_admin, except: [:create]

  def index
    @task_runs = LegacyTaskRun.all.where.not(task_type: 'transcription').order(created_at: :desc).includes(:legacy_prompt)
  end

  def show
    @task_run = LegacyTaskRun.find(params[:id])
  end

  def create
    check_token

    @task_run = LegacyTaskRunner.run_for!(
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
