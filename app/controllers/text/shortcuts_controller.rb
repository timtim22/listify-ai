class Text::ShortcutsController < ApplicationController
  before_action :authenticate_user!
  before_action :find_shortcut, only: [:update, :destroy]

  def index
    @shortcuts = current_user.text_shortcuts
    respond_to do |format|
      format.html
      format.json { render :index, status: :ok }
    end
  end

  def create
    @shortcut = current_user.text_shortcuts.new(text_shortcut_params)
    respond_to do |format|
      if @shortcut.save
        format.json { render :create, status: :created, notice: 'Saved!' }
      else
        format.json { render json: @shortcut.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @shortcut.update(text_shortcut_params)
        format.json { render :update, status: :ok, notice: 'Saved!' }
      else
        format.json { render json: @shortcut.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    if @shortcut.destroy
      respond_to do |format|
        format.json { render :destroy, status: :ok }
      end
    end
  end

  private

  def text_shortcut_params
    params.require(:shortcut).permit(:field, controls: [])
  end

  def find_shortcut
    @shortcut = current_user.text_shortcuts.find(params[:id])
  end
end
