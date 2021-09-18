class AddCustomRunLimitToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :custom_run_limit, :integer
  end
end
