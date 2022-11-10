class Procedures::MultistepRequestWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform(procedure_id, task_run_id)
    
  end
end
