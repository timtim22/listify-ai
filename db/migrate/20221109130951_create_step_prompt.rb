class CreateStepPrompt < ActiveRecord::Migration[6.1]
  def change
    create_table :step_prompts, id: :uuid do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.string :stop
      t.float :temperature, null: false
      t.integer :max_tokens, default: 100
      t.float :top_p, null: false
      t.float :frequency_penalty, null: false
      t.float :presence_penalty, null: false
      t.string :engine, null: false
      t.integer :remote_model_id
      t.integer :number_of_results, default: 1
      t.string :labels
      t.string :service

      t.timestamps
    end
  end
end
