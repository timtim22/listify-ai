class Api::V1::Listings::TitlesController < Api::V1::ApiController
  before_action :output_language
  before_action :params_validation
  include ApiInputTextConcern

  def create
    save = Input.create_with(Listing.new(listing_params), current_user)
    return json_unprocessable_entity unless save.success

    @listing = save.input_object
    @task_run = TaskRunners::OneStep.new.run_for!(@listing, current_user, output_language, true)
    handle_expected_result do
      break if @task_run.has_all_results?
    end

    task_results_response(@task_run.task_results, @task_run.id)
  end

  private

  def output_language
    params[:output_language].presence || 'EN'
  end

  def params_validation
    errors = ApiValidators::Listing.new(params, current_user, output_language).call
    return json_bad_request(errors) if errors.present?
  end

  def listing_params
    {
      request_type: 'listing_title',
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
      json_success(
        'Successfully generated titles',
        result: translated_results(task_results),
        task_run_id: task_run_id
      )
    else
      json_not_found('Something Went Wrong! Please Try Again.')
    end
  end

  def translated_results(task_results)
    task_results.map do |tr|
      final_result = tr.translations.any? ? tr.translations.first : tr
      final_result.result_text
    end
  end

end
