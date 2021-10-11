class AddUserCopiedToTaskResult < ActiveRecord::Migration[6.1]
  def change
    add_column :task_results, :user_copied, :boolean, default: false
  end
end
