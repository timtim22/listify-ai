class Completions::TwoStepRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id, task_run_2_id, prompt_set_2_id)
    first_result = CompletionRequestRunner.new.for(task_run_id, prompt_id, false)
    prompt_set_2 = PromptSet.find(prompt_set_2_id)
    task_run_2 = TaskRun.find(task_run_2_id)
    if first_result.success
      task_run_2.input_object.update(input_text: first_result.result_text&.strip) # if no error
      prompt_set_2.prompts.map do |prompt|
        Completions::OneStepRequestWorker.perform_async(task_run_2_id, prompt.id)
      end
    else
      prompt_set_2.prompts.map do |prompt|
        task_run_2.task_results.create!(
          success: false,
          prompt: prompt,
          result_text: "An error occurred processing this request. We're sorry about that. Please try again or contact us if this keeps happening.",
          error: "An error occurred in a previous step of this request.".to_json
        )
      end
    end
  end
end
