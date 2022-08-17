module ApiClients
  class GoogleCloudTranslate

    TOKEN = Rails.application.credentials.dig(:google, :cloud_translate, :service_key)
    URL = 'https://translation.googleapis.com/language/translate/v2'.freeze
    OUTPUT_LANGUAGE_CODES = %w[SR SR-LATN].freeze

    def self.supports_output_language?(code)
      OUTPUT_LANGUAGE_CODES.include?(code)
    end

    def translate(from, to, text)
      body = translate_request_body(from, to, text)
      #url = "#{URL}?target=#{to.downcase}&source=#{from.downcase}&q=#{text}&key=#{AUTH_KEY}"
      binding.pry
      res = request('post', URL, headers, body)
      binding.pry
      translation_result(res, from, to)
    end

    def translate_request_body(from, to, text)
      {
        source: from.downcase,
        target: to.downcase,
        q: text,
        format: 'text'
      }
    end

    def translation_result(response, from, to)
      {
        from: from,
        to: to,
        text: response.dig('data', 'translations', 'translated_text'),
        success: response[:error].blank?,
        error: response[:error]
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

      puts response
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
