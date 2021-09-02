class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :recoverable, :rememberable, :validatable

  has_many :legacy_task_runs
  has_many :task_runs, dependent: :destroy
  has_many :listings, dependent: :destroy
end
