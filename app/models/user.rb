class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :legacy_task_runs
  has_many :task_runs, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy
  has_many :listings, dependent: :destroy

  attr_accessor :early_access_code
  validates :early_access_code, inclusion: { in: ['MIN39210'] }, on: :create
end
