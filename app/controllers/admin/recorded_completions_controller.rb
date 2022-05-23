class Admin::RecordedCompletionsController < ApplicationController
  before_action :authenticate_admin

  def index
    @completions_by_task_run =
      RecordedCompletion
      .where('task_run_created_at > ?', 1.week.ago)
      .includes(:user)
      .order(created_at: :desc)
      .limit(200)
      .group_by(&:task_run_created_at)
      .sort
      .reverse
  end

  def show
    @recorded_completion = RecordedCompletion.find(params[:id])
  end
end
