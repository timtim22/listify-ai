class AddInputLanguageToListings < ActiveRecord::Migration[6.1]
  def change
    add_column :listings, :input_language, :string, default: "EN"
    add_column :listings, :untranslated_input_text, :text
    remove_column :listings, :property_type
    remove_column :listings, :location
    remove_column :listings, :sleeps
  end
end
