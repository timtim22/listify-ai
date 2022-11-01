class CreateListifyModules < ActiveRecord::Migration[6.1]
  def change
    create_table :listify_modules, id: :uuid do |t|
      t.string :name
      t.timestamps
    end

    create_table :enabled_modules, id: :uuid do |t|
      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :listify_module, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end
