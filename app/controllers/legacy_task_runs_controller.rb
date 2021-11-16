class LegacyTaskRunsController < ApplicationController
  before_action :authenticate_admin

  def index
    @task_runs = LegacyTaskRun.all
      .where.not(task_type: 'transcription')
      .order(created_at: :desc)
      .includes(:legacy_prompt)
    @pagy, @task_runs = pagy(@task_runs)
  end
end
