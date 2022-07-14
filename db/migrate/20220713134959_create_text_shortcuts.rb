class CreateTextShortcuts < ActiveRecord::Migration[6.1]
  def change
    create_table :text_shortcuts, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.string :field, null: false
      t.string :controls, array: true, default: []

      t.timestamps
    end
  end
end
