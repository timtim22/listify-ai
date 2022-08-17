require "google/cloud/translate/v2"

module ApiClients
  class GoogleCloudTranslate

    CREDENTIALS = Rails.application.credentials.dig(:google, :cloud_translate)
    URL = 'https://translation.googleapis.com/language/translate/v2'.freeze
    OUTPUT_LANGUAGE_CODES = %w[SR SR-LATN].freeze

    def initialize
      @translation_service = Google::Cloud::Translate::V2.new(
        credentials: CREDENTIALS
      )
    end

    def self.supports_output_language?(code)
      OUTPUT_LANGUAGE_CODES.include?(code)
    end

    def translate(from, to, text)
      res = @translation_service.translate(text, from: from, to: to)
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
        text: response.text,
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
