class PromptsController < ApplicationController
  before_action :authenticate_user!
  before_action :authorize_prompt
  before_action :set_prompt_set
  before_action :set_prompt, only: [:edit, :update, :destroy]
  before_action :set_service_options, only: [:new, :edit]

  def new
    @prompt = @prompt_set.prompts.new_from_defaults
  end

  def edit
  end

  def create
    @prompt = @prompt_set.prompts.new(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: 'Prompt created.' }
        format.json { redirect_to @prompt_set, status: :created, notice: 'Prompt created.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @prompt.assign_attributes(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: 'Prompt updated.' }
        format.json { redirect_to @prompt_set, status: :created, notice: 'Prompt updated.' }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @prompt.destroy
      respond_to do |format|
        format.html { redirect_to prompt_set_url(@prompt_set), notice: 'Prompt deleted.' }
        format.json { head :no_content, status: :ok }
      end
    end
  end

  private

  def prompt_params
    params.require(:prompt).permit(
      :title, :content, :stop, :temperature, :max_tokens, :top_p, :service,
      :frequency_penalty, :presence_penalty, :engine, :remote_model_id, :labels
    )
  end

  def authorize_prompt
    authorize Prompt
  end

  def set_prompt_set
    @prompt_set = PromptSet.find(params[:prompt_set_id])
  end

  def set_prompt
    @prompt = @prompt_set.prompts.find(params[:id])
  end

  def set_service_options
    @service_options = if Rails.env.production?
      Completion::Services::PRODUCTION
    else
      Completion::Services::ALL
    end
  end
end
