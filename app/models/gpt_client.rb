class GptClient

  TOKEN = Rails.application.credentials.dig(:gpt, :api_key)

  def execute_request(prompt)
    if prompt.model
      body = generate_model_body(prompt)
      request('post', model_url, headers, body)
    else
      body = generate_body(prompt)
      request('post', url_for(prompt), headers, body)
    end
  end

  def model_url
    "https://api.openai.com/v1/completions"
  end

  def url_for(prompt)
    "https://api.openai.com/v1/engines/#{prompt.engine}/completions"
  end

  private

  def headers
    {
      "Content-Type": "application/json",
      "Authorization": "Bearer #{TOKEN}"
    }
  end

  def generate_body(prompt)
    body_params = {
      "prompt" => prompt.body,
      "temperature" => prompt.temperature,
      "max_tokens" => prompt.max_tokens,
      "top_p" => prompt.top_p,
      "frequency_penalty" => prompt.frequency_penalty,
      "presence_penalty" => prompt.presence_penalty
    }

    if stop_sequence_present?(prompt)
      body_params["stop"] = set_stop_sequence(prompt)
    end
    body_params.to_json
  end

  def generate_model_body(prompt)
    {
      "prompt" => prompt.body,
      "max_tokens" => prompt.max_tokens,
      "stop" => [" END"],
      "model" => prompt.model
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
      { result_text: body["choices"].first.dig("text"), success: true }
    else
      { error: response.body, success: false }
    end
  end

  def stop_sequence_present?(prompt)
    !([nil, ""].include?(prompt.stop))
  end

  def set_stop_sequence(prompt)
    if prompt.stop == "\\n"
      ["\n", "\n\n"]
    else
      [prompt.stop]
    end
  end
end
