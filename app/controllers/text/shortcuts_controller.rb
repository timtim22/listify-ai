class Text::ShortcutsController < ApplicationController
  before_action :authenticate_user!

  def index
    @shortcuts = current_user.text_shortcuts
  end

  def create
    @shortcut = current_user.text_shortcuts.new(text_shortcut_params)
    respond_to do |format|
      if @shortcut.save
        format.json { render :create, status: :created }
      else
        format.json { render json: @shortcut.errors, status: :unprocessable_entity }
      end
    end
  end

  def update
    @shortcut = current_user.text_shortcuts.find(params[:id])
    respond_to do |format|
      if @shortcut.update(text_shortcut_params)
        format.json { render :update, status: :ok }
      else
        format.json { render json: @shortcut.errors, status: :unprocessable_entity }
      end
    end
  end

  private

  def text_shortcut_params
    params.require(:shortcut).permit(:field, controls: [])
  end
end
