class Team < ApplicationRecord
  has_many :team_roles, dependent: :destroy
  has_many :users, through: :team
end
