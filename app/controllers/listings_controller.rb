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
      @task_run = TaskRunners::OneStep.new.run_for!(@listing, current_user, params[:output_language])
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

  def input_text
    lines = listing_params[:input_text].split("\n")
    if lines.first.include? 'studio'
      lines.first.sub!(/\d+ bedroom /, '')
      lines.join("\n")
    else
      listing_params[:input_text]
    end
  end

  def params_in_english
    translator = Translations::Runner.new
    translation_params = translator.request_in_english(
      listing_params[:input_language],
      input_text
    )
    listing_params.merge(translation_params)
  end

  def listing_params
    params.require(:listing).permit(:request_type, :input_text, :input_language)
  end
end

