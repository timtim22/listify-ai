class ChangePromptsToLegacyPrompts < ActiveRecord::Migration[6.1]
  def change
    rename_table :prompts, :legacy_prompts
    rename_table :task_runs, :legacy_task_runs
    rename_column :legacy_task_runs, :prompt_id, :legacy_prompt_id
  end
end
