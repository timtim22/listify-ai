class Completions::OneStepRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id, api_request)
    CompletionRequestRunner.new.for(task_run_id, prompt_id, api_request)
  end
end
