class CreatePlans < ActiveRecord::Migration[6.1]
  def change
    create_table :plans, id: :uuid do |t|
      t.string :name
      t.integer :amount
      t.string :interval
      t.string :stripe_id

      t.timestamps
    end
  end
end
