class WritingsController < ApplicationController
  before_action :authenticate_user!

  def new
    @writing = Writing.new
    @runs_remaining = current_user.runs_remaining_today
  end

  def create
    save = Input.create_with(Writing.new(writing_params), current_user)
    if save.success
      @writing  = save.input_object
      @task_run = TaskRunner.new.run_for!(@writing, current_user)
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

  def writing_params
    params.require(:writing).permit(:request_type, :input_text)
  end
end

