class AddExpectedResultsToTaskRun < ActiveRecord::Migration[6.1]
  def change
    add_column :task_runs, :expected_results, :integer
  end
end
