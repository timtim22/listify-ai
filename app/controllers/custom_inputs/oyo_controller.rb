class CustomInputs::OyoController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    save = Input.create_with(oyo_object.new(oyo_params), current_user)
    if save.success
      @oyo_obj  = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@oyo_obj, current_user)
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

  def oyo_object
    case oyo_params[:request_type]
    when 'oyo_one' then CustomInputs::OyoOne
    when 'oyo_two' then CustomInputs::OyoTwo
    when 'oyo_three' then CustomInputs::OyoThree
    end
  end

  def oyo_params
    params.require(:oyo).permit(
      :request_type, :property_type, :target_user, :location, :location_detail,
      :usp_one, :usp_two, :usp_three, :usp_four, :usp_five
    )
  end
end
