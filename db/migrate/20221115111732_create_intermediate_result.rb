class CreateIntermediateResult < ActiveRecord::Migration[6.1]
  def change
    create_table :intermediate_results, id: :uuid do |t|
      t.integer    :position
      t.string     :error
      t.jsonb      :input
      t.jsonb      :output
      t.references :task_run, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
