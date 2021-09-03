class CreateTasks < ActiveRecord::Migration[6.1]
  def change
    create_table :task_runs, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :prompt_set, null: false, foreign_key: true, type: :uuid
      t.references :input_object, type: :uuid, polymorphic: true
      t.timestamps
    end

    create_table :task_results, id: :uuid do |t|
      t.references :task_run, null: false, foreign_key: true, type: :uuid
      t.references :prompt, null: false, foreign_key: true, type: :uuid
      t.boolean :success
      t.string :result_text
      t.string :error
      t.timestamps
    end
  end
end
