class GptResultWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(task_run_id, prompt_id)
    GptResult.new.for(task_run_id, prompt_id)
  end
end
