class GptCallGenerator

  CHECK_CONTENT = <%= ENV['CONTENT_CHECK_ENABLED'] %>

  def self.generate_for(prompt, input_object)
    request_object = generate_request_object(prompt, input_object.input_text)
    request_config = generate_config(prompt)
    GptCall.new(request_object, request_config)
  end

  private

  def self.generate_config(prompt)
   {
     engine: prompt.engine,
     model: prompt.gpt_model_id,
     check_content: CHECK_CONTENT
   }
  end

  def self.generate_request_object(prompt, input_text)
    if prompt.gpt_model_id.present?
      model_request_body(prompt, input_text)
    else
      text_request_body(prompt, input_text)
    end
  end

  def self.model_request_body(prompt, input_text)
    body = construct_prompt_body(prompt.content, input_text).gsub("\\n", "\n")
    {
      "prompt" => body,
      "max_tokens" => prompt.max_tokens,
      "stop" => [" END"],
      "model" => prompt.gpt_model_id
    }.to_json
  end

  def self.text_request_body(prompt, input_text)
    body = construct_prompt_body(prompt.content, input_text)
    body_params = {
      "prompt" => body,
      "temperature" => prompt.temperature,
      "max_tokens" => prompt.max_tokens,
      "top_p" => prompt.top_p,
      "frequency_penalty" => prompt.frequency_penalty,
      "presence_penalty" => prompt.presence_penalty
    }

    if prompt.stop_sequence_present?
      body_params["stop"] = set_stop_sequence(prompt)
    end
    body_params.to_json
  end

  def self.construct_prompt_body(prompt_text, input_text)
    prompt_text.gsub("{input}", input_text)
  end

  def self.set_stop_sequence(prompt)
    if prompt.stop == "\\n"
      ["\n", "\n\n"]
    else
      [prompt.stop]
    end
  end
end
