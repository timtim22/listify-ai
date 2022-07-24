module ApiClients
  class Ai21

    TOKEN = Rails.application.credentials.dig(:ai21, :api_key)

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
      if config[:engine] == 'j1-grande-instruct'
        experimental_request(request_params, config[:engine])
      elsif config[:model].present?
        request_with_model(request_params, config[:engine], config[:model])
      else
        request_without_model(request_params, config[:engine])
      end
    end

    def experimental_request(body, engine)
      request('post', experimental_url(engine), headers, body)
    end

    def request_with_model(body, engine, model)
      request('post', trained_model_url(engine, model), headers, body)
    end

    def request_without_model(body, engine)
      request('post', untrained_url(engine), headers, body)
    end

    def trained_model_url(engine, model)
      "https://api.ai21.com/studio/v1/#{engine}/#{model}/complete"
    end

    def untrained_url(engine)
      "https://api.ai21.com/studio/v1/#{engine}/complete"
    end

    def experimental_url(engine)
      "https://api.ai21.com/studio/v1/experimental/#{engine}/complete"
    end

    def headers
      {
        'Content-Type': 'application/json',
        'Authorization': "Bearer #{TOKEN}"
      }
    end

    def request(method, url, headers, body)
      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])


      puts 'AI21 RESPONSE RECEIVED'
      puts '------'

      if response.code == 200
        JSON.parse(response.body)
      else
        error_response(response)
      end
    end

    def wrap_successful_response(response, config)
      {
        service: Completion::Services::AI21,
        success: true,
        result_text: response['completions'][0]['data']['text'],
        should_check_content: config[:check_content]
      }
    end

    def error_response(response)
      {
        service: Completion::Services::AI21,
        success: false,
        error: response.body
      }
    end
  end
end
