class CreateFeedbacks < ActiveRecord::Migration[6.1]
  def change
    create_table :feedbacks, id: :uuid do |t|
      t.references :task_run, null: false, foreign_key: true, type: :uuid
      t.string :sentiment

      t.timestamps
    end
  end
end
