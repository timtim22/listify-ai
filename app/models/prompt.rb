class Prompt < ApplicationRecord
  belongs_to :prompt_set
  has_many :task_results, dependent: :nullify

  acts_as_list scope: :prompt_set

  validates :title, :content, presence: true

  GPT_ENGINES = %w[ada babbage curie curie-instruct-beta davinci davinci-instruct-beta text-curie-002 text-davinci-001 text-davinci-002].freeze
  AI21_ENGINES = %w[j1-large j1-grande j1-jumbo j1-grande-instruct].freeze
  COHERE_ENGINES = %w[large xlarge].freeze
  MOCK_ENGINES = %w[mock-engine].freeze
  ENGINES = { gpt: GPT_ENGINES, ai21: AI21_ENGINES, cohere: COHERE_ENGINES, mock: MOCK_ENGINES }.freeze

  SERVICE_CONSTRAINTS = {
    gpt: {
      engines: GPT_ENGINES,
      frequency_penalty: { max: 1.0 }
    },
    ai21: {
      engines: AI21_ENGINES,
      frequency_penalty: { max: 500.0 }
    },
    cohere: {
      engines: COHERE_ENGINES,
      temperature: { max: 5.0 },
      frequency_penalty: { max: 1.0 }
    },

    mock: { engines: MOCK_ENGINES, scales: {} }
  }

  def self.new_from_defaults
    new(
      stop: '\\n',
      max_tokens: 250,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      service: Completion::Services::GPT,
      engine: 'text-davinci-002'
    )
  end

  def gpt_model_id # column renamed
    remote_model_id
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
