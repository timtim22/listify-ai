class CreateProcedure < ActiveRecord::Migration[6.1]
  def change
    create_table :procedures, id: :uuid do |t|
      t.string :title
      t.string :tag

      t.timestamps
    end
  end
end
