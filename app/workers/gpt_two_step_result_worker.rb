class GptTwoStepResultWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id, task_run_2_id, prompt_set_2_id)
    first_result = GptResult.new.for(task_run_id, prompt_id)
    prompt_set_2 = PromptSet.find(prompt_set_2_id)
    task_run_2 = TaskRun.find(task_run_2_id)
    task_run_2.input_object.update(input_text: first_result.result_text) # if no error
    prompt_set_2.prompts.map do |prompt|
      GptResultWorker.perform_async(task_run_2_id, prompt.id)
    end
  end
end
