class Admin::ExamplesController < ApplicationController
  before_action :authenticate_admin
  before_action :set_example, only: %i[ show edit update destroy ]

  def index
    @examples = Example.all

    @pagy, @examples = pagy(@examples)
  end

  def new
    @example = Example.new
  end

  def destroy
    @example.destroy

    respond_to do |format|
      format.html { redirect_to admin_examples_url, notice: 'Example was successfully destroyed.' }
    end
  end

  private

  def set_example
    @example = Example.find(params[:id])
  end

  def example_params
    params.require(:example).permit(:title)
  end
end
