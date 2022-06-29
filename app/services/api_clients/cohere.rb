module ApiClients
  class Cohere

    TOKEN = Rails.application.credentials.dig(:cohere, :api_key)

    def run_request!(request_params, config)
      response = request_for(request_params, config)
      if response[:error]
        response
      else
        wrap_successful_response(response, config)
      end
    end

    private

    def request_for(request_params, config)
      if config[:model].present?
        raise 'Attempted to use a Cohere model!'
      else
        request_without_model(request_params, config[:engine])
      end
    end

    def request_without_model(body, engine)
      request('post', untrained_url(engine), headers, body)
    end

    def untrained_url(engine)
      "https://production.api.cohere.ai/#{engine}/generate"
    end

    def headers
      {
        'Content-Type': 'application/json',
        'Authorization': "Bearer #{TOKEN}",
        'Cohere-Version': '2021-11-08'
      }
    end

    def request(method, url, headers, body)
      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])


      puts 'COHERE RESPONSE RECEIVED'
      puts '------'

      if response.code == 200
        JSON.parse(response.body)
      else
        error_response(response)
      end
    end

    def wrap_successful_response(response, config)
      {
        service: Completion::Services::COHERE,
        success: true,
        result_text: response['generations'][0]['text'],
        should_check_content: config[:check_content]
      }
    end

    def error_response(response)
      {
        service: Completion::Services::COHERE,
        success: false,
        error: response.body
      }
    end
  end
end
