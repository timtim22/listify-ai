module ApiClients
  class AzureTranslate

    API_KEY = Rails.application.credentials.dig(:azure, :translate_api_key)
    BASE_URL = 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0'.freeze
    OUTPUT_LANGUAGE_CODES = {
      'SR' => 'SR-CYRL',
      'SR-LATN' => 'SR-LATN'
    }.freeze

    def self.supports_output_language?(code)
      OUTPUT_LANGUAGE_CODES.keys.include?(code)
    end

    def headers
      {
        'Content-Type' => 'application/json',
        'Ocp-Apim-Subscription-Region' => 'uksouth',
        'Ocp-Apim-Subscription-Key' => API_KEY
      }
    end

    def translate(from, to, text)
      to = OUTPUT_LANGUAGE_CODES[to]
      req_url = "#{BASE_URL}&from=#{from}&to=#{to}"
      res = request('post', req_url, headers, [{ "Text": text }])
      translation_result(res, from, to)
    end

    def translation_result(response, from, to)
      {
        from: from,
        to: to,
        text: response.dig(:text, 0, 'translations', 0, 'text'),
        success: response[:success],
        error: response[:error]
      }
    end

    def request(method, url, headers, body)
      puts method, url, headers.except('Ocp-Apim-Subscription-Key'), body

      response = HTTParty.send(method, *[url, {
        headers: headers,
        body: body.to_json
        # debug_output: $stdout
      }])

      puts 'AZURE TRANSLATE RESPONSE RECEIVED'
      puts '------'

      if response.code == 200
        { text: JSON.parse(response.body), success: true }
      else
        { error: JSON.parse(response.body), success: false }
      end
    end
  end
end
