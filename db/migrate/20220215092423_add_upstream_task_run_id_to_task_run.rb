class AddUpstreamTaskRunIdToTaskRun < ActiveRecord::Migration[6.1]
  def change
    add_column :task_runs, :upstream_task_run_id, :string
  end
end
