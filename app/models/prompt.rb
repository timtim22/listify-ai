class Prompt < ApplicationRecord
  belongs_to :prompt_set
  has_many :task_results, dependent: :nullify

  acts_as_list scope: :prompt_set

  validates :title, :content, presence: true

  ENGINES = %w[ada babbage curie curie-instruct-beta davinci davinci-instruct-beta text-curie-001 text-davinci-001 text-davinci-002].freeze

  def self.new_from_defaults
    new(
      stop: '\\n',
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: 'text-davinci-001'
    )
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
