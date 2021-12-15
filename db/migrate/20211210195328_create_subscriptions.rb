class CreateSubscriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :subscriptions, id: :uuid do |t|
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.string :stripe_id
      t.string :stripe_plan
      t.string :status
      t.datetime :trial_ends_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
