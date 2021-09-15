class TaskRerunsController < ApplicationController
  before_action :authenticate_user!

  def create
    last_run = TaskRun.find(task_rerun_params[:task_run_id])
    new_input_object = last_run.input_object.dup
    save = Input.create_with(new_input_object, current_user)
    if save.success
      @object = save.input_object
      @task_run = TaskRunner.run_for!(@object, current_user)
      @runs_remaining = TaskRun.runs_remaining_today(current_user)
    end

    respond_to do |format|
      if save.success
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  def task_rerun_params
    params.require(:task_rerun).permit(:task_run_id)
  end
end
