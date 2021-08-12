class VersionsController < ApplicationController
  skip_before_action :verify_authenticity_token, only: [:show]
  respond_to :json

  def show
    @version = '0.2'
  end
end
