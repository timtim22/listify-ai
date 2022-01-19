class AddPromotionCodeToUser < ActiveRecord::Migration[6.1]
  def change
    add_column :users, :promotion_code, :string
  end
end
