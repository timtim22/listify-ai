class PlaygroundAttemptsController < ApplicationController
  before_action :authenticate_admin

  def new
    @playground_attempt = PlaygroundAttempt.new
    @prompt_sets = PromptSet.all.includes(:prompts)
  end

  def create
    save = Input.create_with(PlaygroundAttempt.new(playground_attempt_params), current_user)
    if save.success
      @playground_attempt  = save.input_object
      @task_run = TaskRunner.run_for!(@playground_attempt, current_user)
    end

    respond_to do |format|
      if save.success
        format.json { render :create, status: :created }
      else
        format.json { render json: save.errors, status: :unprocessable_entity }
      end
    end
  end

  def playground_attempt_params
    params.require(:playground_attempt).permit(:request_type, :input_text)
  end
end

