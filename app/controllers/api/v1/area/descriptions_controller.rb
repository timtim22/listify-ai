class Api::V1::Area::DescriptionsController < Api::V1::ApiController
  before_action :admin_user
  before_action :set_area_description
  before_action :params_validation
  include ApiInputTextConcern

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    @description.update_form(
      params[:selected_ids],
      detail_text,
      params[:user_provided_area_name]
    )
    save = Input.create_with(@description, current_user)
    if save.success
      @area_description = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@area_description, current_user)
      @runs_remaining -= 1
    end
    sleep 10
    @task_results = @task_run.task_results.map(&:result_text)

    json_success('Successfully Generated Area Descriptions', area_description: @task_results)
  end

  private

  def admin_user
    json_unauthorized('You are not authorized to access this endpoint. Only admin can access this endpoint.') unless current_user.admin
  end

  def set_area_description
    if !SearchLocation.find_by(id: params[:search_location_id]).nil?
      search_location = SearchLocation.find_by(id: params[:search_location_id])
      @description = search_location.area_descriptions.order(:created_at).last
    else
      json_bad_request('Search Location does not exist')
    end
  end

  def params_validation
    area_description_validation = ApiAreaDescriptionValidation.new(@description, params).call
    return json_bad_request(area_description_validation) if area_description_validation.present?
  end

  def detail_text
    generate_detail_text(params[:detail_text])
  end
end
