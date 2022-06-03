class AddCustomTrialEndDateToUsers < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :custom_trial_end_date, :datetime
  end
end
