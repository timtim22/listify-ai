class CreateContentFilterResults < ActiveRecord::Migration[6.1]
  def change
    create_table :content_filter_results, id: :uuid do |t|
      t.references :task_result, null: false, foreign_key: true, type: :uuid
      t.string :decision
      t.string :label
      t.jsonb :data

      t.timestamps
    end
  end
end
