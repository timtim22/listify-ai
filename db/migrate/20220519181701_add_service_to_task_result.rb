class AddServiceToTaskResult < ActiveRecord::Migration[6.1]
  def change
    add_column :task_results, :service, :string
  end
end
