class CreatePromptSets < ActiveRecord::Migration[6.1]
  def change
    create_table :prompt_sets, id: :uuid do |t|
      t.string :title
      t.string :request_type
      t.timestamps
    end

    create_table :prompts, id: :uuid do |t|
      t.references :prompt_set, null: false, foreign_key: true, type: :uuid
      t.string :title, null: false
      t.text :content, null: false
      t.string :stop
      t.float :temperature, null: false
      t.integer :max_tokens, default: 100
      t.float :top_p, null: false
      t.float :frequency_penalty, null: false
      t.float :presence_penalty, null: false
      t.string :engine, null: false
      t.integer :number_of_results, default: 1
      t.integer :position
      t.timestamps
    end
  end
end
