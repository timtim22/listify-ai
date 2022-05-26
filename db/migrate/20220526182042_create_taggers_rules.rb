class CreateTaggersRules < ActiveRecord::Migration[6.1]
  def change
    create_table :taggers_rules, id: :uuid do |t|
      t.string :rule_type
      t.string :input_structure
      t.string :applicable_fields, array: true, default: []
      t.string :tag
      t.string :keywords

      t.timestamps
    end
  end
end
