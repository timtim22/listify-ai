class AddOutputToStepPrompt < ActiveRecord::Migration[6.1]
  def change
    add_column :step_prompts, :output, :text
  end
end
