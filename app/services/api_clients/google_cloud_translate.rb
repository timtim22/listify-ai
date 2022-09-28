module ApiClients
  class GoogleCloudTranslate

    CREDENTIALS = Rails.application.credentials.dig(:google, :cloud_translate)
    API_KEY = Rails.application.credentials.dig(:google, :translate_api_key)
    BASE_URL = 'https://translation.googleapis.com/language/translate/v2'.freeze
    OUTPUT_LANGUAGE_CODES = %w[SR SR-LATN].freeze

    def self.supports_output_language?(code)
      OUTPUT_LANGUAGE_CODES.include?(code)
    end

    def translate(from, to, text)
      req_url = "#{BASE_URL}?target=#{to}&source=#{from}&q=#{text}&key=#{API_KEY}"
      res = request('post', req_url, {}, {})
      translation_result(res, from, to)
    end

    def translation_result(response, from, to)
      {
        from: from,
        to: to,
        text: response['data']['translations'][0]['translatedText'],
        success: true # not clear from documentation / source if response has any error handling...
      }
    end

    def headers
      {
        "Content-Type": 'application/json',
        "Authorization": "Bearer #{TOKEN}"
      }
    end

    def request(method, url, headers, body)
      puts method, url, headers, body

      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])

      puts 'GOOGLE TRANSLATE RESPONSE RECEIVED'
      puts '------'

      if response.code == 200
        JSON.parse(response.body)
      else
        { error: response.body, success: false }
      end
    end
  end
end
