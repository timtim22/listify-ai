class Api::V1::Listings::DescriptionsController < Api::V1::ApiController
  before_action :admin_user
  before_action :output_language
  before_action :params_validation
  include ApiInputTextConcern

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(Listing.new(params_in_english), current_user)
    return json_unprocessable_entity unless save.success

    @listing = save.input_object
    @task_run = TaskRunners::OneStep.new.run_for!(@listing, current_user, output_language, true)
    handle_expected_result do
      break if @task_run.has_all_results?
    end
    @task_results = @task_run.task_results.map(&:result_text)

    task_results_response(@task_results, @task_run.id)
  end

  private

  def admin_user
    json_unauthorized('You are not authorized to access this endpoint. Only admin can access this endpoint.') unless current_user.admin
  end

  def output_language
    params[:output_language].presence || 'EN'
  end

  def params_validation
    listing_validation = ApiListingValidation.new(params, current_user, output_language).call
    return json_bad_request(listing_validation) if listing_validation.present?
  end

  def params_in_english
    translator = Translations::Runner.new
    translation_params = translator.request_in_english(
      'EN',
      input_text
    )
    listing_params.merge(translation_params)
  end

  def listing_params
    {
      request_type: 'listing_description',
      input_text: input_text,
      input_language: 'EN'
    }
  end

  def input_text
    params_input_text(
      params[:text][:number_of_bedrooms],
      params[:text][:location],
      params[:text][:property_type],
      params[:text][:ideal_for],
      params[:text][:features]
    )
  end

  def task_results_response(task_results, task_run_id)
    if task_results.present?
      json_success('Successfully Generated Descriptions', result: task_results, task_run_id: task_run_id)
    else
      json_not_found('Something Went Wrong! Please Try Again.')
    end
  end
end
