class Api::V1::Users::SessionsController < Devise::SessionsController
  respond_to :json

  private

  def respond_with(resource, _opts = {})
    json_success('Logged in Successfully.', token: current_token)
  end

  def respond_to_on_destroy
    log_out_success
  end

  def log_out_success
    json_success('Logged out Successfully.')
  end
end
