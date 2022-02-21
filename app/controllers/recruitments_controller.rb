class RecruitmentsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:create]
  #before_action :add_allow_credentials_headers

  #def add_allow_credentials_headers
    #response.headers['Access-Control-Allow-Origin'] = request.headers['Origin'] || '*'
    #response.headers['Access-Control-Allow-Credentials'] = 'true'
    #response.headers['Access-Control-Allow-Headers'] = 'accept, content-type'
  #end

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
end
