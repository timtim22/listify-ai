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

desc 'Send alert for teams with 80% usage of monthly spins'
task send_80_percent_consumed_spins_notifications: [:environment] do
  Team.all.each do |team|
    team_user = team.users.first
    spin_counter = SpinCounter.new(team_user)
    spins_used = spin_counter.team_spins_used
    spins_used_yesterday = spin_counter.team_spins_used_yesterday
    next if spins_used_yesterday >= team.monthly_spins * 0.80
    next unless spins_used >= team.monthly_spins * 0.80

    AdminMailer.spins_80_percent_consumed(team, spins_used).deliver_later
  end
end

desc 'Send weekly email for admins on usage'
task send_weekly_email_for_usage: [:environment] do
  teams_data = Team.all.map do |team|
    spin_counter = SpinCounter.new
    spin_counter.team_spin_stats(team)
  end
  AdminMailer.monthly_spin_usage(teams_data).deliver_later
end
