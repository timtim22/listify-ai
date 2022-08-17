module ApiClients
  class DeepL

    AUTH_KEY = Rails.application.credentials.dig(:deep_l, :api_key)
    OUTPUT_LANGUAGE_CODES = %w[EN DA DE ES FR IT NL RO RU ZH].freeze

    def self.supports_output_language?(code)
      OUTPUT_LANGUAGE_CODES.include?(code)
    end

    def translate(from, to, text)
      url  = 'https://api.deepl.com/v2/translate'
      body = translate_request_body(from, to, text)
      res  = request('post', url, {}, body)
      translation_result(res, from, to)
    end

    def translate_request_body(from, to, text)
      {
        source_lang: from,
        target_lang: to,
        text: text,
        auth_key: AUTH_KEY
      }
    end

    def translation_result(response, from, to)
      {
        from: from,
        to: to,
        text: response.dig('translations', 0, 'text'),
        success: !(response[:error].present?),
        error: response[:error]
      }
    end

    def request(method, url, headers, body)
      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body,
        #debug_output: $stdout
      }])

      puts 'DEEPL RESPONSE'
      #binding.pry
      #puts response
      puts '------'

      if response.code == 200
        JSON.parse(response.body)
      else
        { error: response.body, success: false }
      end
    end

  end
end
