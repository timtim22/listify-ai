class Step::Prompt < ApplicationRecord
  has_many :task_results, dependent: :nullify
  self.table_name = "step_prompts"

  def run(task_run_id, step_prompt_id, last_step, procedure, input)
    if last_step
      CompletionRequestRunner.new.for(task_run_id, step_prompt_id, procedure)
      input
    else
      IntermediateRequestRunner.new.for(task_run_id, step_prompt_id, input)
    end
  end

  def gpt_model_id
    remote_model_id
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
