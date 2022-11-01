class ListifyModule < ApplicationRecord
  has_many :enabled_modules, dependent: :destroy
  has_many :users, through: :enabled_modules

  def enable_for(user)
    enabled_modules.create(user: user)
  end
end
