class CreateCharges < ActiveRecord::Migration[6.1]
  def change
    create_table :charges, id: :uuid do |t|
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.string :stripe_id
      t.integer :amount
      t.integer :amount_refunded
      t.string :card_brand
      t.string :card_last4
      t.string :card_exp_month
      t.string :card_exp_year

      t.timestamps
    end
  end
end
