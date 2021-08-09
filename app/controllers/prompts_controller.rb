class PromptsController < ApplicationController
  before_action :authenticate_admin

  def index
    @prompts = Prompt.all
  end

  def new
    @prompt = Prompt.new_from_defaults
  end

  def create
    @prompt = Prompt.new(prompt_params)

    respond_to do |format|
      if @prompt.save
        format.html { redirect_to prompts_path, notice: "Prompt was successfully created." }
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
