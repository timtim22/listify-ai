class ChangeListingDetailsToInputText < ActiveRecord::Migration[6.1]
  def change
    rename_column :listings, :details, :input_text
  end
end
