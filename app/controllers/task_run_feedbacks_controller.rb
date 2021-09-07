class TaskRunFeedbacksController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_admin, only: [:index]

  def index
    @task_run_feedbacks = TaskRunFeedback.all
  end

  def create
    @task_run = TaskRun.find(params[:task_run_id])
    @feedback = current_user.task_run_feedbacks.new(
      task_run_feedback_params.merge(task_run: @task_run)
    )
    respond_to do |format|
      if @feedback.save
        format.json { render :create, status: :created }
      else
        format.json { render json: @feedback.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def task_run_feedback_params
    params.require(:task_run_feedback).permit(:score, :comment)
  end
end
