class AddAccountLockedToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :account_locked, :boolean, default: false
  end
end
