class Api::V1::TaskRunsController < Api::V1::ApiController
  before_action :params_validation
  def show
    @task_run = TaskRun.find_by(id: params[:task_run_id])

    json_success('Successfully fetched Task Run', @task_run)
  end

  private

  def params_validation
    if params[:task_run_id].blank?
      json_bad_request('task_run_id is required field')
    elsif TaskRun.find_by(id: params[:task_run_id]).nil?
      json_not_found('Could not found Task Run')
    end
  end
end
