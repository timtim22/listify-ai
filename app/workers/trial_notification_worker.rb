class TrialNotificationWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform
    puts 'Sending trial notification emails...'
    TrialNotification.new.send_due!
  end
end
