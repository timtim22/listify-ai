class Api::V1::ListingsController < Api::V1::ApiController
  include ApiInputTextConcern

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(Listing.new(params_in_english), current_user)
    return json_unprocessable_entity unless save.success

    @listing = save.input_object
    @task_run = TaskRunners::OneStep.new.run_for!(@listing, current_user, params[:output_language])
    sleep 10
    @task_results = @task_run.task_results.map(&:result_text)

    task_results_response(@task_results)
  end

  private

  def params_in_english
    translator = Translations::Runner.new
    translation_params = translator.request_in_english(
      listing_params[:input_language],
      listing_params[:input_text]
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
      params[:no_of_bedrooms],
      params[:location],
      params[:property_type],
      params[:ideal_for],
      params[:features]
    )
  end

  def task_results_response(task_results)
    if task_results.present?
      json_success('Successfully Generated Discriptions', task_results)
    else
      json_not_found('Something Went Wrong! Please Try Again.')
    end
  end
end
