class CreateTeams < ActiveRecord::Migration[6.1]
  def change
    create_table :teams, id: :uuid do |t|
      t.string :name
      t.timestamps
    end
    create_table :team_roles, id: :uuid do |t|
      t.belongs_to :team, null: false, foreign_key: true, type: :uuid
      t.belongs_to :user, null: false, foreign_key: true, type: :uuid
      t.string :name, null: false
      t.timestamps
    end
  end
end
