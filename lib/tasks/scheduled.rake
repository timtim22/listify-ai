# scheduled tasks running in production

desc 'Send gpt request to keep models warm'
task send_gpt_request: [:environment] do |t, args|
  GptRefreshWorker.perform_async
end

desc 'send trial notification emails'
task send_trial_notifications: [:environment] do |t, args|
  TrialNotificationWorker.perform_async
end
