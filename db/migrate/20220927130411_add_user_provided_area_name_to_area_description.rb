class AddUserProvidedAreaNameToAreaDescription < ActiveRecord::Migration[6.1]
  def change
    add_column :area_descriptions, :user_provided_area_name, :string
  end
end
