module ApiClients
  class Gpt

    TOKEN = Rails.application.credentials.dig(:gpt, :api_key)

    def run_request!(request_params, config)
      response = request_for(request_params, config)
      if response[:error]
        response
      else
        wrap_successful_response(response, request_params, config)
      end
    end

    def request_content_filter(body)
      engine = 'content-filter-alpha-c4'
      request('post', url_for(engine), headers, body)
    end

    private

    def request_for(request_params, config)
      if config[:model].present?
        request_with_model(request_params)
      else
        request_without_model(request_params, config[:engine])
      end
    end

    def request_with_model(body)
      request('post', model_url, headers, body)
    end

    def request_without_model(body, engine)
      request('post', url_for(engine), headers, body)
    end

    def model_url
      'https://api.openai.com/v1/completions'
    end

    def url_for(engine)
      "https://api.openai.com/v1/engines/#{engine}/completions"
    end

    def headers
      {
        "Content-Type": "application/json",
        "Authorization": "Bearer #{TOKEN}"
      }
    end

    def request(method, url, headers, body)
      #binding.pry
      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])

      puts "GPT RESPONSE: #{url}"

      if response.code == 200
        JSON.parse(response.body)
      else
        error_response(response)
      end
    end

    def wrap_successful_response(response, request_params, config)
      {
        service: Completion::Services::GPT,
        success: true,
        result_text: response['choices'].first['text'],
        user_id: JSON.parse(request_params)['user'],
        should_check_content: config[:check_content]
      }
    end

    def error_response(response)
      {
        service: Completion::Services::GPT,
        success: false,
        error: response.body
      }
    end
  end
end
