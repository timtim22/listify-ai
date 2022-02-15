class TaskRerunsController < ApplicationController
  before_action :authenticate_user!

  def create
    @runs_remaining = SpinCheck.runs_remaining(current_user)
    last_run = TaskRun.find(task_rerun_params[:task_run_id])
    task_to_rerun = resolve_task_to_rerun(last_run)
    language = task_to_rerun.output_language
    new_input_object = task_to_rerun.input_object.dup
    save = Input.create_with(new_input_object, current_user)
    if save.success
      @object = save.input_object
      @task_run = task_run_for(task_to_rerun, last_run, current_user, language)
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

  def resolve_task_to_rerun(last_run)
    if last_run.upstream_task_run_id?
      TaskRun.find(last_run.upstream_task_run_id)
    else
      last_run
    end
  end

  def task_run_for(task_to_rerun, last_run, current_user, language)
    if task_to_rerun.id == last_run.id
      TaskRunners::OneStep.new.run_for!(@object, current_user, language)
    else
      TaskRunners::TwoStep.new.run_for!(
        @object,
        current_user,
        last_run.input_object.request_type,
        language
      )
    end
  end
end
