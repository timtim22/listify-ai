module RequestAssemblers
  class GptText

    def self.parameters(prompt, prompt_body, input_object)
      body_params = {
        'prompt' => prompt_body,
        'temperature' => prompt.temperature,
        'max_tokens' => prompt.max_tokens,
        'top_p' => prompt.top_p,
        'frequency_penalty' => prompt.frequency_penalty,
        'presence_penalty' => prompt.presence_penalty,
        'user' => input_object.user.id
      }

      if prompt.stop_sequence_present?
        body_params['stop'] = set_stop_sequence(prompt)
      end
      body_params.to_json
    end

    def self.set_stop_sequence(prompt)
      if prompt.stop == "\\n"
        ["\n", "\n\n"]
      else
        [prompt.stop]
      end
    end
  end
end


