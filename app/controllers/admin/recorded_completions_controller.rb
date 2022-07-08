class Admin::RecordedCompletionsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_recorded_completion

  def index
    @completions_by_task_run =
      RecordedCompletion
      .where('task_run_created_at > ?', 4.days.ago)
      .where(user_id: users_in_view)
      .includes(:user)
      .order(created_at: :desc)
      .limit(400)
      .group_by(&:task_run_created_at)
      .sort
      .reverse

    last_24_hr_stats
  end

  def show
    @recorded_completion = RecordedCompletion.find(params[:id])
    respond_to do |format|
      format.html
      format.json { render json: @recorded_completion, status: :ok }
    end
  end

  def search
    @completions_by_task_run =
      RecordedCompletion
      .joins(:user).where('users.email like ?', '%' + params[:query] + '%')
      .where(user_id: users_in_view)
      .order(created_at: :desc)
      .limit(400)
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

  def last_24_hr_stats
    last_24_hr_spins = @completions_by_task_run.select { |k, v| k >= 24.hours.ago }
    @last_24_hr_stats = OpenStruct.new(
      spin_count: last_24_hr_spins.count,
      request_counts: last_24_hr_spins.map { |k, v| v.first.request_type }.tally,
      user_counts: last_24_hr_spins.map { |k, v| v.first.user.email }.tally
    )
  end
end
