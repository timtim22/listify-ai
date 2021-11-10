class CreateTranslationRequests < ActiveRecord::Migration[6.1]
  def change
    create_table :translation_requests, id: :uuid do |t|
      t.string :from, default: "en-gb"
      t.string :to
      t.references :task_run, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
