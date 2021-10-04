class Prompt < ApplicationRecord
  belongs_to :prompt_set
  has_many :task_results, dependent: :nullify

  acts_as_list scope: :prompt_set

  validates :title, :content, presence: :true

  ENGINES = ["ada", "babbage", "curie", "curie-instruct-beta", "davinci", "davinci-instruct-beta"].freeze

  def self.new_from_defaults
    self.new(
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
