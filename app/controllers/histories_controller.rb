class HistoriesController < ApplicationController
  before_action :authenticate_admin

  def show
    start_date = Date.new(2022, 2, 18).beginning_of_day # to exclude results before upstream ids migration
    recent_task_runs = current_user.task_runs
      .where('created_at > ?', start_date)
      .includes(:input_object, :task_results, task_results: [:content_filter_results, :translations])
      .order(created_at: :desc)
      .limit(50)

    @task_runs = recent_task_runs.reject do |tr|
      tr.upstream_task_run_id &&
        recent_task_runs.none? { |t| t.id == tr.upstream_task_run_id }
    end
    @upstream_ids = recent_task_runs.map(&:upstream_task_run_id).compact
  end
end
