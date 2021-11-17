class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @show_example = params[:show_example]
    @runs_remaining = TaskRun.runs_remaining_today(current_user)
  end

  def create
    save = Input.create_with(Listing.new(params_for_language), current_user)
    if save.success
      @listing  = save.input_object
      @task_run = TaskRunner.new.run_for!(@listing, current_user, params[:output_language])
      @runs_remaining = TaskRun.runs_remaining_today(current_user)
    end

    respond_to do |format|
      if save.success
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def params_for_language
    language = listing_params[:input_language]
    if language.present? && language != "EN"
      translation_result = DeepLClient.new.translate(
        language,
        "EN-GB",
        listing_params[:input_text]
      )
      listing_params.merge({
        input_language: language,
        untranslated_input_text: listing_params[:input_text],
        input_text: translation_result[:error] ? "" : translation_result[:text]
      })
    else
      listing_params
    end
  end

  def listing_params
    params.require(:listing).permit(:request_type, :input_text, :input_language)
  end
end

