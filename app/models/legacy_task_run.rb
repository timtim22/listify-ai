class LegacyTaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :legacy_prompt

  has_many :feedbacks, dependent: :destroy
end
