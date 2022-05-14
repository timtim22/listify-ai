class GptCheckedResponse
  PASS            = "pass".freeze
  FAIL            = "fail".freeze
  TOXIC_THRESHOLD = -0.355

  def self.for(response, client = ApiClients::Gpt.new)
    filter_check = run_filter_check(response, client)
    check_result = result_for(filter_check)
    response.merge({ check_result: check_result })
  end

  private

  def self.run_filter_check(response, client)
    params = check_params(response)
    client.request_content_filter(params)
  end

  def self.result_for(check_response)
    if check_response[:error]
      check_response
    else
      label = decide_label(check_response)
      {
        decision: safe_outcome?(label) ? PASS : FAIL,
        label: label,
        data: check_response.to_json
      }
    end
  end

  def self.decide_label(check_response)
    first_choice = check_response["choices"][0]["text"]
    if first_choice != "2"
      first_choice
    else
      decide_on_confidence(check_response)
    end
  end

  def self.decide_on_confidence(check_response)
    logprobs = check_response["choices"][0]["logprobs"]["top_logprobs"][0]
    if logprobs["2"] > TOXIC_THRESHOLD
      "2"
    elsif logprobs["0"] && logprobs["0"] > logprobs["2"]
      "0"
    elsif logprobs["1"] && logprobs["1"] > logprobs["2"]
      "1"
    else
      "2"
    end
  end

  def self.safe_outcome?(label)
    ["0", "1"].include?(label.to_s)
  end

  def self.check_params(response)
    prompt_content = '<|endoftext|>' + response[:result_text] + '\n--\nLabel:'
    {
      "prompt" => prompt_content,
      "temperature" => 0,
      "max_tokens" => 1,
      "top_p" => 0,
      "frequency_penalty" => 0,
      "presence_penalty" => 0,
      "logprobs" => 10,
      "user" => response[:user_id]
    }.to_json
  end
end
