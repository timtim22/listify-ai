class Admin::RecordedCompletionsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_recorded_completion

  def index
    @completions_by_task_run =
      RecordedCompletion
      .where('task_run_created_at > ?', 1.week.ago)
      .where(user_id: users_in_view)
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

  def search
    @completions_by_task_run =
      RecordedCompletion
      .joins(:user).where('users.email like ?', '%' + params[:query] + '%')
      .where(user_id: users_in_view)
      .order(created_at: :desc)
      .limit(200)
      .group_by(&:task_run_created_at)
      .sort
      .reverse
  end

  private

  def authorize_recorded_completion
    authorize RecordedCompletion
  end

  def users_in_view
    if current_user.admin? && params[:user]
      User.where(email: params[:user])
    elsif (current_user.on_listify_team? && !current_user.admin?) || params[:admin]
      User.where(admin: true).or(User.where.not(authorization_scopes: []))
    else
      User.where.not(admin: true)
    end.pluck(:id)
  end
end
