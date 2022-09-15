class Api::V1::ApiController < ActionController::Base
  protect_from_forgery with: :null_session

  def current_token
    request.env['warden-jwt_auth.token']
  end

  def json_success(message = nil, data = nil)
    response = generate_response(message: message, data: data)
    render json: response, status: 200
  end

  def json_bad_request(message = "Bad Request", errors = nil)
    response = generate_response(message: message, errors: errors)
    render json: response, status: 400
  end

  def json_forbidden(message = "Forbidden")
    response = generate_response(message: message)
    render json: response, status: 403
  end

  def json_not_found(message = "Not Found")
    response = generate_response(message: message)
    render json: response, status: 404
  end

  def json_unprocessable_entity(message = "Unprocessable Entity", errors = nil)
    response = generate_response(message: message, errors: errors)
    render json: response, status: 422
  end

  def json_not_acceptable
    render json: {message: "Please use 'Accept: application/json' in your request header"}, status: 406
  end

  def generate_response(message: nil, data: nil, errors: nil, refresh_token: nil)
    response = {}
    response[:message] = message if message.present?
    response[:data] = data if data.present?
    response[:errors] = errors if errors.present?
    response[:refresh_token] = refresh_token if refresh_token.present?
    response
  end
end