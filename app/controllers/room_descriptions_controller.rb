class RoomDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    room = RoomDescription.new(room_description_params)
    room.request_type = 'room_step_1_text' if params[:just_beds]
    save = Input.create_with(room, current_user)
    if save.success
      @room_description = save.input_object
      run_task!
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

  def run_task!
    @task_run = TaskRunners::TwoStep.new.run_for!(
      @room_description,
      current_user,
      'room_step_2',
      params[:output_language]
    )
  end

  def room_description_params
    params.require(:room_description).permit(:request_type, :input_text)
  end
end

