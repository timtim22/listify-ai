class AddMockRequestFieldToTaskRun < ActiveRecord::Migration[6.1]
  def change
    add_column :task_runs, :mock_request, :boolean, default: false
  end
end
