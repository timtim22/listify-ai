class CreateTeamInvitations < ActiveRecord::Migration[6.1]
  def change
    create_table :team_invitations, id: :uuid do |t|
      t.string :email
      t.references :team, null: false, foreign_key: true, type: :uuid
      t.integer :status

      t.timestamps
    end
  end
end
