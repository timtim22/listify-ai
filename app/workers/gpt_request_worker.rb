class GptRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id)
    GptRequestRunner.new.for(task_run_id, prompt_id)
  end
end
