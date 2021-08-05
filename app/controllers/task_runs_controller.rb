class TaskRunsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :authenticate_admin, except: [:create]

  def index
    @task_runs = TaskRun.all.order(created_at: :desc).includes(:prompt)
  end

  def show
    @task_run = TaskRun.find(params[:id])
  end

  def create
    check_token

    if false #testing without gpt calls
      input_text = params[:text] || TextFromSpeech.new.from(params[:blob])
      @task_run = TaskRun.new(input_text: input_text, result_text: input_text)
    else
      @task_run = TaskRunner.run_for!(
        params[:text],
        params[:blob],
        params[:task_type]
      )
    end

    respond_to do |format|
      if true
        format.json { render status: :ok }
      end
    end

  end

  def check_token
    auth_token = Rails.application.credentials.base_ext_token
    if request.headers['HTTP_AUTHORIZATION'] != auth_token
      raise "Token invalid!"
    end
  end

end
