class Procedure < ApplicationRecord
  has_many :registered_steps, -> { order(position: :asc) }, dependent: :destroy
end
