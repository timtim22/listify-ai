class DeepLClient

  AUTH_KEY = Rails.application.credentials.dig(:deep_l, :api_key)

  def translate(from, to, text)
    url  = "https://api-free.deepl.com/v2/translate"
    body = translate_request_body(from, to, text)
    res  = request("post", url, {}, body)
    { from: from, to: to, text: res["translations"][0]["text"] }
  end

  def translate_request_body(from, to, text)
    {
      source_lang: "EN",
      target_lang: to,
      text: text,
      auth_key: AUTH_KEY
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
