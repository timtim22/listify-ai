class Step::Prompt < ApplicationRecord
  has_many :task_results, dependent: :nullify
  self.table_name = 'step_prompts'

  validates :title, :content, presence: true

  def run(task_run_id, step_prompt_id, last_step, procedure, input)
    if last_step
      CompletionRequestRunner.new.for(task_run_id, step_prompt_id, procedure)
    else
      IntermediateRequestRunner.new.for(task_run_id, step_prompt_id, input)
    end
  end

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

  def gpt_model_id
    remote_model_id
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
