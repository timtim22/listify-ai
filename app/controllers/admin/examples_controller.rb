class Admin::ExamplesController < ApplicationController
  before_action :authenticate_admin

  def index
    @examples = Example.all

    @pagy, @examples = pagy(@examples)
  end
end
