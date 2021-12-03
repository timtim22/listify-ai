class GptClient

  TOKEN = Rails.application.credentials.dig(:gpt, :api_key)

  def request_with_model(body)
    request('post', model_url, headers, body)
  end

  def request_with_text(body, engine)
    request('post', url_for(engine), headers, body)
  end

  def request_content_filter(body)
    engine = "content-filter-alpha-c4"
    request('post', url_for(engine), headers, body)
  end

  private

  def model_url
    "https://api.openai.com/v1/completions"
  end

  def url_for(engine)
    "https://api.openai.com/v1/engines/#{engine}/completions"
  end

  def headers
    {
      "Content-Type": "application/json",
      "Authorization": "Bearer #{TOKEN}"
    }
  end

  def request(method, url, headers, body)
    #binding.pry
    response = HTTParty.send(method, *[url, {
      headers: headers,
      body: body,
      #debug_output: $stdout
    }])

    puts "GPT RESPONSE"
    puts response
    puts "------"

    if response.code == 200
      JSON.parse(response.body)
    else
      { error: response.body, success: false }
    end
  end
end
