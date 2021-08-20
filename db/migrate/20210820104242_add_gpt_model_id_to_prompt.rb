class AddGptModelIdToPrompt < ActiveRecord::Migration[6.1]
  def change
    add_column :prompts, :gpt_model_id, :string
  end
end
