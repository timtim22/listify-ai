class ChangeStepPomptIdDataType < ActiveRecord::Migration[6.1]
  def change
    add_column :task_results, :step_prompt_id, :string
  end
end
