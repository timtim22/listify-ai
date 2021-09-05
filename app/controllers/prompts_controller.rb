class PromptsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_prompt_set
  before_action :set_prompt, only: [:edit, :update, :destroy]

  def new
    @prompt = @prompt_set.prompts.new_from_defaults
  end

  def edit
  end

  def update
    @prompt.assign_attributes(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: "Prompt updated." }
        format.json { render :show, status: :created, location: prompt_set_path(@prompt_set) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def create
    @prompt = @prompt_set.prompts.new(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: "Prompt updated." }
        format.json { render :show, status: :created, location: prompt_set_path(@prompt_set) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @prompt.destroy
      respond_to do |format|
        format.html { redirect_to prompt_set_url(@prompt_set), notice: "Prompt deleted." }
        format.json { head :no_content }
      end
    end
  end

  private

  def prompt_params
    params.require(:prompt).permit(
      :title, :content, :stop, :temperature, :max_tokens, :top_p,
      :frequency_penalty, :presence_penalty, :engine, :gpt_model_id, :labels
    )
  end

  def set_prompt_set
    @prompt_set = PromptSet.find(params[:prompt_set_id])
  end

  def set_prompt
    @prompt = @prompt_set.prompts.find(params[:id])
  end
end
