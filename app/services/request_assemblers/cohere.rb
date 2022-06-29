module RequestAssemblers
  class Cohere

    def self.parameters(prompt, prompt_body, _input_object)
      {
        "prompt": prompt_body,
        "num_generations": prompt.number_of_results,
        "max_tokens": prompt.max_tokens,
        "temperature": prompt.temperature,
        "k": 0,
        "p": prompt.top_p,
        "frequency_penalty": prompt.frequency_penalty,
        "presence_penalty": prompt.presence_penalty,
        "stop_sequences": stop_sequence(prompt.stop)
      }.to_json
    end

    def self.stop_sequence(stop)
      stop.present? ? [stop] : []
    end
  end
end
