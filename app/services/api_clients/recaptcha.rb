module ApiClients
  class Recaptcha

    SECRET = Rails.application.credentials.dig(:recaptcha, :secret_key)
    URL    = 'https://www.google.com/recaptcha/api/siteverify'.freeze

    def verify_response(response_token)
      body = { secret: SECRET, response: response_token }
      request('post', URL, {}, body)
    end

    def request(method, url, headers, body)
      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])

      if response.code == 200
        JSON.parse(response.body)
      else
        { error: response.body, success: false }
      end
    end
  end
end
