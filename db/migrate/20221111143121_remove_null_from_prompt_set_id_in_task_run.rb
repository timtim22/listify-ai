class RemoveNullFromPromptSetIdInTaskRun < ActiveRecord::Migration[6.1]
  def change
    change_column_null :task_runs, :prompt_set_id, true
  end
end
