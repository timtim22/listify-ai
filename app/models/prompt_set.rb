class PromptSet < ApplicationRecord
  has_many :task_runs, dependent: :destroy
  has_many :prompts, -> { order(position: :asc) }, dependent: :destroy

  def self.for(request_type)
    PromptSet.find_by(request_type: request_type)
  end
end
