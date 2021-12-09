class RoomDescriptionsController < ApplicationController
  before_action :authenticate_user!

  def create
    save = Input.create_with(RoomDescription.new(room_description_params), current_user)
    if save.success
      @room_description = save.input_object
      @task_run = TaskRunners::TwoStep.new.run_for!(@room_description, current_user, params[:output_language])
      @runs_remaining = current_user.runs_remaining_today
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

  def room_description_params
    params.require(:room_description).permit(:request_type, :input_text)
  end
end

