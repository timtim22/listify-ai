class TaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :prompt

  has_many :feedbacks, dependent: :destroy
end
