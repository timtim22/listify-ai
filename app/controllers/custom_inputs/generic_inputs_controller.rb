class CustomInputs::GenericInputsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(Inputs::GenericInput.new(generic_input_params), current_user)
    if save.success
      @obj = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@obj, current_user)
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

  def generic_input_params
    params.require(:generic_input).permit(:request_type, :input_text)
  end
end


