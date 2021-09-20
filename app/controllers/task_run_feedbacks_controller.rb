class TaskRunFeedbacksController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_admin, only: [:index]

  def index
    @task_run_feedbacks = TaskRunFeedback.all.includes(:user, task_run: [:input_object, :task_results]).order(created_at: :desc)
    @pagy, @task_run_feedbacks = pagy(@task_run_feedbacks)
  end

  def create
    @feedback = current_user.task_run_feedbacks.new(task_run_feedback_params)
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
    params.require(:task_run_feedback).permit(:task_run_id, :score, :comment)
  end
end
