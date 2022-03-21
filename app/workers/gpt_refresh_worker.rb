class GptRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform
    Rails.logger.info 'Running Gpt refresh worker...'
    GptRefresh.new.run!
  end
end
