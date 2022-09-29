module RequestSpecHelper
  def json
    JSON.parse(response.body)
  end

  def auth_token(user)
    post '/api/v1/users/sign_in', params: { email: user.email, password: user.password }
    json['data']['token']
  end
end