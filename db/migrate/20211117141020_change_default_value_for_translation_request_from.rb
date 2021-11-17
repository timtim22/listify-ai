class ChangeDefaultValueForTranslationRequestFrom < ActiveRecord::Migration[6.1]
  def change
    change_column_default :translation_requests, :from, from: "en-gb", to: "EN"
  end
end
