class GptTwoStepResultWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id, task_run_2_id, prompt_2_id)
    first_result = GptResult.new.for(task_run_id, prompt_id)
    task_run_2 = TaskRun.find(task_run_2_id)
    task_run_2.input_object.update(input_text: first_result.result_text) # if no error
    second_result = GptResult.new.for(task_run_2_id, prompt_2_id)
  end
end
