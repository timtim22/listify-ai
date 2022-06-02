# scheduled tasks running in production

desc 'Send gpt request to keep models warm'
task send_gpt_request: [:environment] do |t, args|
  GptRefreshWorker.perform_async
end

desc 'send trial notification emails'
task send_trial_notifications: [:environment] do |t, args|
  TrialNotificationWorker.perform_async
end

desc 'create missing completions'
task :create_missing_completions, [:number] => [:environment] do |t, args|
  task_results = TaskResult.where.missing(:recorded_completion).limit(args[:number])
  puts "Selected #{task_results.count} task results..."
  task_results.each do |t|
    begin
      if !t.task_run.user.admin?
        request, config = RequestAssemblers::Coordinate.for(t.prompt, t.task_run.input_object)
        RecordedCompletion.create_for(t.task_run, t, request, config)
        puts '.'
      end
    rescue StandardError => e
      puts "Error for #{t.id}: #{e}"
    end
  end
end
