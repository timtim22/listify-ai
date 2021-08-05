class GptClient
  attr_reader :prompt, :original_text

  TOKEN = Rails.application.credentials.dig(:gpt, :api_key)
  URL = "https://api.openai.com/v1/engines/davinci-instruct-beta/completions"

  def initialize(prompt, text)
    @prompt = prompt
    @original_text = text
  end

  def generate_request
    body = generate_body(prompt)
    request('post', URL, headers, body)
  end

  def headers
    {
      "Content-Type": "application/json",
      "Authorization": "Bearer #{TOKEN}"
    }
  end

  def generate_body(prompt)
    {
      "prompt" => prompt.body,
      "temperature" => prompt.temperature,
      "max_tokens" => prompt.max_tokens,
      "top_p" => prompt.top_p,
      "frequency_penalty" => prompt.frequency_penalty,
      "presence_penalty" => prompt.presence_penalty,
      "stop" => [prompt.stop]
    }.to_json
  end

  def request(method, url, headers, body)
    response = HTTParty.send(method, *[url, {
      headers: headers,
      body: body,
      #debug_output: $stdout
    }])

   puts "GPT RESPONSE"
   puts response
   puts "------"

   if response.code == 200
      body = JSON.parse(response.body)
      {
        response_text: body["choices"].first.dig("text"),
        original_text: original_text,
        success: true
      }
    else
      { error: response.body, success: false }
    end
  end
end
