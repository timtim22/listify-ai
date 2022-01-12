class GptRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform
    puts "Running Gpt refresh worker..."
    GptRefresh.new.run!
  end
end
