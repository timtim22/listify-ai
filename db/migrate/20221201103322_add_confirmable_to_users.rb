class AddConfirmableToUsers < ActiveRecord::Migration[6.1]
  def change
    change_table :users, bulk: true do |t|
      t.column :confirmation_token, :string
      t.column :confirmed_at, :datetime
      t.column :confirmation_sent_at, :datetime
      t.column :unconfirmed_email, :string
      t.index  :confirmation_token, unique: true
    end
    update_confirmation_of_existing_users
  end

  def update_confirmation_of_existing_users
    User.update_all(confirmed_at: Time.zone.now)
  end
end
