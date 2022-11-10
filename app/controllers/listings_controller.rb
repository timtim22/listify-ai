class ListingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @show_example = params[:show_example]
    @runs_remaining = current_user.runs_remaining_today
  end

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(Listing.new(params_in_english), current_user)
    if save.success
      @listing  = save.input_object
      @task_run = TaskRunners::Multistep.new.run_for!(@listing, current_user, false)
      @runs_remaining -= 1
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

  def params_in_english
    input_text = InputTextService.new(listing_params[:input_text]).call
    translator = Translations::Runner.new
    translation_params = translator.request_in_english(
      listing_params[:input_language],
      input_text
    )
    listing_params.merge(input_text: input_text).merge(translation_params)
  end

  def listing_params
    params.require(:listing).permit(:request_type, :input_text, :input_language)
  end
end