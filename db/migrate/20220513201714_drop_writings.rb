class DropWritings < ActiveRecord::Migration[6.1]
  def change
    drop_table :writings
  end
end
