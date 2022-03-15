class RecruitmentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  #before_action :add_allow_credentials_headers, only: [:create]
  before_action :authenticate_admin, except: [:create]

  #def add_allow_credentials_headers
    #response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    #response.headers['Access-Control-Allow-Credentials'] = 'true'
    #response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
  #end

  def create
    auth_token = Rails.application.credentials.extension[:token]
    raise 'Auth error!'if params[:auth] != auth_token # temp solution!
    @task_run_result = Demo::ProfileSummariser.new(params[:profile]).run!

    respond_to do |format|
      if @task_run_result.success
        format.json { render :create, status: :created }
      else
        format.json { render json: @task_run_result.errors, status: :unprocessable_entity }
      end
    end
  end
end
