class RecruitmentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  before_action :add_allow_credentials_headers, only: [:create]
  before_action :authencticate_admin, except: [:create]

  #def add_allow_credentials_headers
    #response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    #response.headers['Access-Control-Allow-Credentials'] = 'true'
    #response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
  #end

  def new
  end

  def create
    authorise_with_token
    @task_run_result = Demo::ProfileSummariser.new(params[:profile]).run!

    respond_to do |format|
      if @task_run_result.success
        format.json { render :create, status: :created }
      else
        format.json { render json: @task_run_result.errors, status: :unprocessable_entity }
      end
    end
  end

  def create_job
    respond_to do |format|
      format.json { render :create_job, status: :created }
    end
  end

  def fetch_job
    send_file(
      Rails.root.join('public/demo-profile-outputs.csv'),
      filename: 'profile_summaries.csv',
      type: 'application/csv'
    )
  end
end
