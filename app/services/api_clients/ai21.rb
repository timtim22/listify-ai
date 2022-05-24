module ApiClients
  class Ai21

    TOKEN = Rails.application.credentials.dig(:ai21, :api_key)
    MODEL = 'j1-jumbo'.freeze

    def run_request!(request_params, config)
      response = request('post', url, headers, request_params)
      if response[:error]
        response
      else
        wrap_successful_response(response, config)
      end
    end

    private

    def url
      "https://api.ai21.com/studio/v1/#{MODEL}/complete"
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
