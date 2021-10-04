class RemovePromptNullConstraintFromTaskResult < ActiveRecord::Migration[6.1]
  def up
    change_column_null(:task_results, :prompt_id, true)
  end

  def down
    change_column_null(:task_results, :prompt_id, false)
  end
end
