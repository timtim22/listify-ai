class TeamRole < ApplicationRecord
  belongs_to :team
  belongs_to :user

  USER_ROLE = 'user'.freeze
  ADMIN_ROLE = 'admin'.freeze
  PURCHASER_ROLE = 'purchaser'.freeze

  def self.create_user_role(team, user)
    create(team: team, user: user, name: USER_ROLE)
  end

  def purchaser?
    name == PURCHASER_ROLE
  end
end
