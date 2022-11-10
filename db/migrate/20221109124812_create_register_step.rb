class CreateRegisteredStep < ActiveRecord::Migration[6.1]
  def change
    create_table :registered_steps, id: :uuid do |t|
      t.integer    :position
      t.references :procedure, null: false, foreign_key: true, type: :uuid
      t.references :step, polymorphic: true, null: false, type: :uuid

      t.timestamps
    end
  end
end
