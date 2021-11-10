class CreateTranslations < ActiveRecord::Migration[6.1]
  def change
    create_table :translations, id: :uuid do |t|
      t.references :translatable, type: :uuid, polymorphic: true
      t.string :from, null: false
      t.string :to, null: false
      t.boolean :success
      t.text :result_text
      t.string :error

      t.timestamps
    end
  end
end
