class CreateTaskRunFeedbacks < ActiveRecord::Migration[6.1]
  def change
    create_table :task_run_feedbacks, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :task_run, null: false, foreign_key: true, type: :uuid
      t.integer :score
      t.text :comment

      t.timestamps
    end
  end
end
