class Api::V1::Area::DescriptionsController < Api::V1::ApiController
  before_action :params_validation
  before_action :set_area_description
  include ApiInputTextConcern

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(@description, current_user)
    if save.success
      @area_description = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@area_description, current_user)
      @runs_remaining -= 1
    end

    handle_expected_result do
      break if @task_run.has_all_results?
    end
    @task_results = @task_run.task_results.map(&:result_text)

    json_success('Successfully Generated Area Descriptions', result: @task_results, task_run_id: @task_run.id)
  end

  private

  def set_area_description
    @description = ApiSearchResult.new(params, detail_text).call
    return json_bad_request("#{@description[:data]} does not exist") if @description[:error] == true
  end

  def params_validation
    errors = ApiValidators::AreaDescription.new(params, current_user).call
    return json_bad_request(errors) if errors.present?
  end

  def detail_text
    generate_detail_text(params[:detail_text])
  end
end
