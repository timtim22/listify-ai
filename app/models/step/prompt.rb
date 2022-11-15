class Step::Prompt < ApplicationRecord
  self.table_name = "step_prompts"

  def run(task_run_id, step_prompt_id, last_step)
    if last_step
      CompletionRequestRunner.new.for(task_run_id, step_prompt_id)
    else
      IntermediateRequestRunner.new.for(task_run_id, step_prompt_id)
    end
  end

  def gpt_model_id
    remote_model_id
  end

  def stop_sequence_present?
    !([nil, ""].include?(self.stop))
  end
end
