class PlaygroundAttemptsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_playground_attempt

  def new
    @playground_attempt = Inputs::PlaygroundAttempt.new
    @prompt_sets = PromptSet.all.includes(:prompts)
  end

  def create
    save = Input.create_with(Inputs::PlaygroundAttempt.new(playground_attempt_params), current_user)
    if save.success
      @playground_attempt = save.input_object
      @task_run = TaskRunners::OneStep.new.run_for!(@playground_attempt, current_user)
    end

    respond_to do |format|
      if save.success
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def authorize_playground_attempt
    authorize Inputs::PlaygroundAttempt
  end

  def playground_attempt_params
    params.require(:playground_attempt).permit(:request_type, :input_text)
  end
end

