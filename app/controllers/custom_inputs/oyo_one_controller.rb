class CustomInputs::OyoOneController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(CustomInputs::OyoOne.new(oyo_one_params), current_user)
    if save.success
      @oyo_one  = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@oyo_one, current_user)
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

  def oyo_one_params
    params.require(:oyo_one).permit(
      :request_type, :property_type, :target_user, :location, :location_detail, :usp_one, :usp_two, :usp_three
    )
  end
end
