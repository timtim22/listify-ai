class CustomInputs::VacasaController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(CustomInputs::VacasaOne.new(vacasa_params), current_user)
    if save.success
      @object  = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@object, current_user)
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

  def vacasa_params
    params.require(:vacasa).permit(
      :request_type, :property_type, :property_name, :target_user, :location,
      :usp_one, :usp_two, :usp_three, :usp_four, :usp_five
    )
  end
end
