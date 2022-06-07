class CustomInputs::SykesController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(CustomInputs::SykesMiddle.new(sykes_params), current_user)
    if save.success
      @sykes_obj  = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@sykes_obj, current_user)
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

  def sykes_params
    params.require(:sykes_middle).permit(:request_type, :key_features)
  end
end

