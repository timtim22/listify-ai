class GptRefresh

  attr_reader :user, :one_step_task_runner, :two_step_task_runner

  REFRESH_HOURS = 4

  def initialize
    @user = User.find_by(email: 'test2@venturerocket.co.uk')
    @one_step_task_runner = TaskRunner.new
    @two_step_task_runner = TaskRunners::TwoStep.new
  end

  def run!
    create_listing_spin
    create_room_spin
  end

  private

  def create_listing_spin
    if recent_spins_for("Listing") > 0
      log_skipping("listing")
    else
      log_running("listing")
      save = create_input("Listing")
      if save.success
        one_step_task_runner.run_for!(save.input_object, user, nil)
      end
    end
  end

  def create_room_spin
    if recent_spins_for("RoomDescription") > 0
      log_skipping("room")
    else
      log_running("room")
      save = create_input("RoomDescription")
     if save.success
        two_step_task_runner.run_for!(
          save.input_object,
          user,
          'full_listing_room_step_2', # only uses 1 spin
          nil
        )
      end
    end
  end

  def create_input(input_object_type)
    new_input_object = last_user_spin_for(input_object_type).input_object.dup
    Input.create_with(new_input_object, user)
  end

  def recent_spins_for(input_object_type)
    TaskRun.where('created_at > ?', REFRESH_HOURS.hours.ago)
      .where(input_object_type: input_object_type)
      .count
  end

  def last_user_spin_for(input_object_type)
    user.task_runs
      .where(input_object_type: input_object_type)
      .order(:created_at).last
  end

  def log_skipping(spin_type)
    puts "Ran a #{spin_type} spin recently, nothing to do."
  end

  def log_running(spin_type)
    puts "Running a #{spin_type} spin..."
  end
end
