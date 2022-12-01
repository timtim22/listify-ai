class Admin::StepPromptsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_step_prompt, only: %i[show edit update destroy]
  before_action :set_service_options, only: %i[new edit]
  before_action :set_procedure

  def new
    @step_prompt = Step::Prompt.new_from_defaults
  end

  def edit; end

  def show; end

  def create
    @step_prompt = Step::Prompt.new(step_prompt_params)
    respond_to do |format|
      if @step_prompt.save
        format.html { redirect_to admin_procedures_path(params[:procedure_id]), notice: 'Step Prompt created.' }
        format.json { redirect_to admin_procedures_path(@procedure), status: :created, notice: 'Step Prompt created.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @step_prompt.errors, status: :unprocessable_entity }
      end
    end
    create_registered_step(@procedure, @step_prompt)
  end

  def update
    @step_prompt.assign_attributes(step_prompt_params)

    respond_to do |format|
      if @step_prompt.save
        format.html { redirect_to admin_procedure_steps_path(params[:procedure_id]), notice: 'Step Prompt updated.' }
        format.json { redirect_to admin_procedures_path(@procedure), status: :created, notice: 'Step Prompt updated.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @step_prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @step_prompt.destroy

    respond_to do |format|
      format.html { redirect_to admin_procedure_steps_path(params[:procedure_id]), notice: 'Step Prompt successfully destroyed.' }
    end
  end

  private

  def create_registered_step(procedure, step_prompt)
    RegisteredStep.create(procedure: procedure, step: step_prompt)
  end

  def set_procedure
    @procedure = params['action'] == 'edit' ? RegisteredStep.find(params[:procedure_id]).procedure : Procedure.find(params[:procedure_id])
  end

  def set_step_prompt
    @step_prompt = Step::Prompt.find(params[:id])
  end

  def step_prompt_params
    params.require(:step_prompt).permit(:title, :content, :stop, :temperature, :max_tokens, :top_p, :frequency_penalty, :presence_penalty, :engine, :remote_model_id, :number_of_results, :labels, :service)
  end

  def set_service_options
    @service_options = Rails.env.production? ? Completion::Services::PRODUCTION : Completion::Services::ALL
  end
end
