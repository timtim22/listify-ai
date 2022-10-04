class AddApiRequestsInTaskRunAndRecordedCompletion < ActiveRecord::Migration[6.1]
  def change
    add_column :task_runs, :api_request, :boolean, default: false
    add_column :recorded_completions, :api_request, :boolean, default: false
  end
end
