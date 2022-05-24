class AddServiceToPrompt < ActiveRecord::Migration[6.1]
  def change
    add_column :prompts, :service, :string
    rename_column :prompts, :gpt_model_id, :remote_model_id
  end
end
