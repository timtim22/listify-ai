class GptRefreshWorker
  include Sidekiq::Worker
  sidekiq_options retry: 0

  def perform
    puts "Running Gpt refresh worker..."
    recent_runs = TaskRun.where('created_at > ?', 4.hours.ago).count
    if recent_runs > 0
      puts "Ran recently, nothing to do."
    else
      puts "Running a request..."
      user = User.find_by(email: 'test2@venturerocket.co.uk')
      last_run = user.task_runs
        .where(input_object_type: 'Listing')
        .order(:created_at).last

      new_input_object = last_run.input_object.dup
      save = Input.create_with(new_input_object, user)
      if save.success
        TaskRunner.new.run_for!(save.input_object, user, nil)
      end
    end
  end
end
