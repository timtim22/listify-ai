class AddTaskRunIdsToFullListing < ActiveRecord::Migration[6.1]
  def change
    add_column :full_listings, :task_run_ids, :string, array: true, default: []
  end
end
