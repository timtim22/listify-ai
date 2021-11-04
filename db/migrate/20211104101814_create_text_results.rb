class CreateTextResults < ActiveRecord::Migration[6.1]
  def change
    create_table :text_results, id: :uuid do |t|
      t.references :task_run, null: false, foreign_key: true, type: :uuid
      t.text :result_text

      t.timestamps
    end
  end
end
