class InputsController < ApplicationController
  skip_before_action :verify_authenticity_token

  def create
    File.open('tmp/recorded.webm', 'wb') do |f|
      f.write params[:blob].read
    end
  end
end
