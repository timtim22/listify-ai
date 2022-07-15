class Admin::ShortcutsController < ApplicationController
  before_action :authenticate_admin

  def index
    @shortcuts = Text::Shortcut.all.includes(:user).order(created_at: :desc)
    @pagy, @shortcuts = pagy(@shortcuts, items: 30)
  end
end
