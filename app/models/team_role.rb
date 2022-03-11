class TeamRole < ApplicationRecord
  belongs_to :team
  belongs_to :user

  USER_ROLE = 'user'.freeze
  ADMIN_ROLE = 'admin'.freeze
  PURCHASER_ROLE = 'purchaser'.freeze

  def self.create_user_role(team, user)
    create(team: team, user: user, name: USER_ROLE)
  end

  def self.create_admin_role(team, user)
    create(team: team, user: user, name: ADMIN_ROLE)
  end

  def admin_privileges?
    [ADMIN_ROLE, PURCHASER_ROLE].include? name
  end

  def purchaser?
    name == PURCHASER_ROLE
  end
end
