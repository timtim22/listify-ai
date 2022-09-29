class Api::V1::ApiController < ActionController::Base
  before_action :authorize_request
  protect_from_forgery with: :null_session

  def authorize_request
    header = get_header
    begin
      @decoded = JsonWebToken.decode(header)
      @current_user = User.find(@decoded[:user_id])
    rescue ActiveRecord::RecordNotFound => e
      render json: { errors: e.message }, status: :unauthorized
    rescue JWT::DecodeError => e
      render json: { errors: e.message }, status: :unauthorized
    end
  end

  def current_user
    header = get_header
    decoded = JWT.decode(header, Rails.application.secret_key_base)[0]
    User.find(decoded['user_id'])
  end

  def get_header
    header = request.headers['Authorization']
    header&.split(' ').last if header
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