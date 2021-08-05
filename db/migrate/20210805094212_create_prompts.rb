class CreatePrompts < ActiveRecord::Migration[6.1]
  def change
    create_table :prompts, id: :uuid do |t|
      t.string :title, null: false
      t.text :content, null: false
      t.string :stop
      t.float :temperature, null: false
      t.integer :max_tokens, default: 100
      t.float :top_p, null: false
      t.float :frequency_penalty, null: false
      t.float :presence_penalty, null: false
      t.string :engine, null: false
      t.boolean :active, default: true
      t.timestamps
    end

    add_reference :task_runs, :prompt, type: :uuid, index: true
    add_foreign_key :task_runs, :prompts
  end
end

