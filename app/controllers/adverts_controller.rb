class AdvertsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(Inputs::Advert.new(params_in_english), current_user)
    if save.success
      @advert = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@advert, current_user, params[:output_language])
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
    translator = Translations::Runner.new
    translation_params = translator.request_in_english(
      advert_params[:input_language],
      advert_params[:input_text]
    )
    advert_params.merge(translation_params)
  end

  def advert_params
    params.require(:advert).permit(:request_type, :input_text, :input_language)
  end
end


