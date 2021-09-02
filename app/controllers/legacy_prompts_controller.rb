class LegacyPromptsController < ApplicationController
  before_action :authenticate_admin

  def index
    @prompts = LegacyPrompt.all
  end

  def new
    @prompt = LegacyPrompt.new_from_defaults
  end

  def create
    @prompt = LegacyPrompt.new(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to legacy_prompts_path, notice: "Prompt was successfully created." }
        format.json { render :show, status: :created, location: prompts_path }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt.errors, status: :unprocessable_entity }
      end
    end
  end

  def prompt_params
    params.require(:prompt).permit(:title, :content, :stop, :temperature, :max_tokens, :top_p, :frequency_penalty, :presence_penalty, :engine)
  end
end
