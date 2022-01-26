class TaskRerunsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    last_run = TaskRun.find(task_rerun_params[:task_run_id])
    language = last_run.output_language
    new_input_object = last_run.input_object.dup
    save = Input.create_with(new_input_object, current_user)
    if save.success
      @object = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@object, current_user, language)
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

  def task_rerun_params
    params.require(:task_rerun).permit(:task_run_id)
  end
end
