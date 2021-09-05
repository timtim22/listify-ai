class AddLabelsToPrompt < ActiveRecord::Migration[6.1]
  def change
    add_column :prompts, :labels, :string
  end
end
