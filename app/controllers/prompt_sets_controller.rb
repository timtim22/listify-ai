class PromptSetsController < ApplicationController
  before_action :authenticate_admin
  before_action :set_prompt_set, only: [:show, :edit, :update, :destroy]

  def index
    @prompt_sets = PromptSet.all
  end

  def show
  end

  def new
    @prompt_set = PromptSet.new
  end

  def edit
  end

  def update
    @prompt_set.update(prompt_set_params)

    respond_to do |format|
      if @prompt_set.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: "Prompt set updated." }
        format.json { render :show, status: :created, location: prompt_set_path(@prompt_set) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt_set.errors, status: :unprocessable_entity }
      end
    end
  end

  def create
    @prompt_set = PromptSet.new(prompt_set_params)

    respond_to do |format|
      if @prompt_set.save
        format.html { redirect_to prompt_set_path(@prompt_set), notice: "Prompt set created." }
        format.json { render :show, status: :created, location: prompt_set_path(@prompt_set) }
      else
        format.html { render :new, status: :unprocessable_entity }
        format.json { render json: @prompt_set.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @prompt_set.destroy
      respond_to do |format|
        format.html { redirect_to prompt_sets_url, notice: "Prompt set deleted." }
        format.json { head :no_content }
      end
    end
  end

  private

  def set_prompt_set
    @prompt_set = PromptSet.find(params[:id])
  end

  def prompt_set_params
    params.require(:prompt_set).permit(:title, :request_type)
  end
end
