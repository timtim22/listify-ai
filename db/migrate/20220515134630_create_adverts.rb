class CreateAdverts < ActiveRecord::Migration[6.1]
  def change
    create_table :adverts, id: :uuid do |t|

      t.string :request_type
      t.text :input_text
      t.text :untranslated_input_text
      t.string :input_language, default: 'EN'
      t.timestamps
    end
  end
end
