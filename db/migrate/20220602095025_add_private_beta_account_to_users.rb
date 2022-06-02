class AddPrivateBetaAccountToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :private_beta_account, :boolean, default: false
  end
end
