class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable, :recoverable, :rememberable, :validatable

  has_many :legacy_task_runs, class_name: "Legacy::TaskRun"
  has_many :task_runs, dependent: :destroy
  has_many :task_run_feedbacks, dependent: :destroy
  has_many :inputs, dependent: :destroy
  has_many :full_listings, dependent: :destroy

  attr_accessor :early_access_code
  validates :early_access_code, inclusion: { in: ['MIN39210'] }, on: :create

  DAILY_RUN_LIMIT = 20

  def runs_remaining_today
    if admin?
      DAILY_RUN_LIMIT
    elsif custom_run_limit
      custom_run_limit - runs_today
    else
      DAILY_RUN_LIMIT - runs_today
    end
  end

  def runs_today
    task_runs.today.where.not(input_object_type: "ListingFragment").count +
    full_listings.today.count
  end
end
