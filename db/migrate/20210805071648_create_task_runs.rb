class CreateTaskRuns < ActiveRecord::Migration[6.1]
  def change
    create_table :task_runs, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :input_source
      t.text :input_text
      t.string :task_type
      t.text :result_text
      t.string :error

      t.timestamps
    end
  end
end
