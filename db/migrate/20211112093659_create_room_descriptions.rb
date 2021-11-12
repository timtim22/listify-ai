class CreateRoomDescriptions < ActiveRecord::Migration[6.1]
  def change
    create_table :room_descriptions, id: :uuid do |t|
      t.text :input_text
      t.string :request_type
      t.string :room

      t.timestamps
    end
  end
end
