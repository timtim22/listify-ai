class HistoriesController < ApplicationController
  before_action :authenticate_user!

  def show
    assign_objects
  end

  private

  def assign_objects
    start_date = history_start_date
    # structured as 3 requests as one request split breaks pagy / may not be memory efficient anyway
    @upstream_ids = current_user.task_runs
      .where('created_at > ?', start_date)
      .pluck(:upstream_task_run_id)

    @upstream_task_runs = current_user.task_runs
      .where(id: @upstream_ids)
      .includes(:input_object)

    @displayable_task_runs = current_user.task_runs
      .where('created_at > ?', start_date)
      .where.not(id: @upstream_ids)
      .includes(:input_object, :task_results, task_results: [:content_filter_results, :translations])
      .order(created_at: :desc)

    @pagy, @displayable_task_runs = pagy(@displayable_task_runs, items: 30)
  end

  def history_start_date
    history_for_plan = Date.today - days_available_on_plan.days
    start_of_history = Date.new(2022, 2, 18) # to exclude results before upstream ids migration
    [start_of_history, history_for_plan].max.beginning_of_day
  end

  def days_available_on_plan
    if current_user.member_of_team?
      180
    elsif current_user.subscribed?
      60
    else
      30
    end
  end
end
