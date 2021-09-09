class LegacyTaskRun < ApplicationRecord
  belongs_to :user
  belongs_to :legacy_prompt
end
