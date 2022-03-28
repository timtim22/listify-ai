class GptRefresh

  attr_reader :user, :one_step_task_runner, :two_step_task_runner

  REFRESH_MINUTES = 60
  LIST_TASK_RUN_ID = '00ebac53-2c24-41de-9db9-f70627d4fe71'.freeze
  ROOM_TASK_RUN_ID = '4c27cc64-fba6-48b1-9626-65e560fbd023'.freeze

  def initialize
    @user = User.find_by(email: 'test2@venturerocket.co.uk')
    @one_step_task_runner = TaskRunners::OneStep.new
    @two_step_task_runner = TaskRunners::TwoStep.new
  end

  def run!
    create_listing_spin
    create_room_spin
  end

  private

  def create_listing_spin
    if recent_spins_for('Listing').positive?
      log_skipping('listing')
    else
      log_running('listing')
      run_listing_spin
    end
  end

  def create_room_spin
    if recent_spins_for('RoomDescription').positive?
      log_skipping('room')
    else
      log_running('room')
      run_room_spin
    end
  end

  def run_listing_spin
    save = create_input(LIST_TASK_RUN_ID)
    if save.success
      one_step_task_runner.run_for!(save.input_object, user, nil)
    else
      Raise "Error saving objects for listing spin: #{save.inspect}"
    end
  end

  def run_room_spin
    save = create_input(ROOM_TASK_RUN_ID)
    if save.success
      two_step_task_runner.run_for!(save.input_object, user, 'room_step_2', nil)
    else
      Raise "Error saving objects for room spin: #{save.inspect}"
    end
  end

  def create_input(task_run_id)
    new_input_object = TaskRun.find(task_run_id).input_object.dup
    Input.create_with(new_input_object, user)
  end

  def recent_spins_for(input_object_type)
    TaskRun
      .where('created_at > ?', REFRESH_MINUTES.minutes.ago)
      .where(input_object_type: input_object_type)
      .count
  end

  def log_skipping(spin_type)
    Rails.logger.info "Ran a #{spin_type} spin recently, nothing to do."
  end

  def log_running(spin_type)
    Rails.logger.info "Running a #{spin_type} spin..."
  end
end
