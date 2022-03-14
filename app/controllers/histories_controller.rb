class HistoriesController < ApplicationController
  before_action :authenticate_user!

  def show
    start_date = Date.new(2022, 2, 18).beginning_of_day # to exclude results before upstream ids migration
    recent_task_runs = current_user.task_runs
      .where('created_at > ?', start_date)
      .includes(:input_object, :task_results, task_results: [:content_filter_results, :translations])
      .order(created_at: :desc)
      .limit(30)

    @task_runs = recent_task_runs.reject do |tr|
      tr.all_results_failed? || upstream_task_run_missing?(tr, recent_task_runs)
    end
    @upstream_ids = recent_task_runs.map(&:upstream_task_run_id).compact
  end

  private

  def upstream_task_run_missing?(task_run, recent_task_runs)
    task_run.upstream_task_run_id &&
      recent_task_runs.none? { |t| t.id == task_run.upstream_task_run_id }
  end
end
