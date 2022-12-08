class Admin::RegisteredStepsController < ApplicationController
  before_action :set_service_options, only: %i[new edit]
  before_action :set_step_prompt, only: %i[show edit update destroy]
  before_action :set_procedure

  def new
    @registered_step = step_prompt_controller.new
  end

  def edit
    step_prompt_controller.edit
  end

  def show
    step_prompt_controller.show
  end

  def create
    step_prompt_controller.create
  end

  def update
    step_prompt_controller.update
  end

  def destroy
    step_prompt_controller.destroy
  end

  private

  def step_prompt_controller
    Admin::StepPromptsController.new
  end

  def set_step_prompt
    @step_prompt = Step::Prompt.find(params[:id])
  end

  def set_service_options
    @service_options = Rails.env.production? ? Completion::Services::PRODUCTION : Completion::Services::ALL
  end

  def set_procedure
    if ['edit', 'destroy', 'show'].include? params['action'] 
      @procedure = RegisteredStep.find(params[:procedure_id]).procedure 
    else
      @procedure = Procedure.find(params[:procedure_id])
    end
  end
end
