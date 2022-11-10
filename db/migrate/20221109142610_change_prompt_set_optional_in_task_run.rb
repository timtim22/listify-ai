class ChangePromptSetOptionalInTaskRun < ActiveRecord::Migration[6.1]
  def change
    remove_column :task_runs, :prompt_set_id
    add_column :task_runs, :prompt_set_id, :integer
  end
end
