class DeepLClient

  AUTH_KEY = Rails.application.credentials.dig(:deep_l, :api_key)

  def translate(from, to, text)
    url  = "https://api-free.deepl.com/v2/translate"
    body = translate_request_body(from, to, text)
    res  = request("post", url, {}, body)
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
      text: response.dig("translations", 0, "text"),
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

    puts "DEEPL RESPONSE"
    puts response
    puts "------"

    if response.code == 200
      JSON.parse(response.body)
    else
      { error: response.body, success: false }
    end
  end

end
