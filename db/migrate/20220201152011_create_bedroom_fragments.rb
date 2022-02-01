class CreateBedroomFragments < ActiveRecord::Migration[6.1]
  def change
    create_table :summary_fragments, id: :uuid do |t|
      t.text :input_text
      t.string :request_type
      t.timestamps
    end

    create_table :bedroom_fragments, id: :uuid do |t|
      t.text :input_text
      t.string :request_type
      t.timestamps
    end

    create_table :other_room_fragments, id: :uuid do |t|
      t.text :input_text
      t.string :request_type
      t.timestamps
    end
  end
end
