class PromptSet < ApplicationRecord
  has_many :task_runs, dependent: :destroy
  has_many :prompts, -> { order(position: :asc) }, dependent: :destroy
end
