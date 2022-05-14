class DropTaskRunFeedbacks < ActiveRecord::Migration[6.1]
  def change
    drop_table :task_run_feedbacks
  end
end
