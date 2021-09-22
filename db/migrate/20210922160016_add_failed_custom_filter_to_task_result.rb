class AddFailedCustomFilterToTaskResult < ActiveRecord::Migration[6.1]
  def change
    add_column :task_results, :failed_custom_filter, :boolean, default: false
  end
end
