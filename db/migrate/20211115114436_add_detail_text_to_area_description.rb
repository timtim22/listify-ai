class AddDetailTextToAreaDescription < ActiveRecord::Migration[6.1]
  def change
    add_column :area_descriptions, :detail_text, :text
  end
end
