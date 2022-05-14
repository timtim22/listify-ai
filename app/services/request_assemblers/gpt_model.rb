module RequestAssemblers
  class GptModel
    def self.parameters(prompt, prompt_body, input_object)
      {
        'prompt' => prompt_body.gsub("\\n", "\n"),
        'max_tokens' => prompt.max_tokens,
        'stop' => ["\n", "\\n", ' END'], # is this correct?
        'model' => prompt.gpt_model_id,
        'temperature' => prompt.temperature,
        'frequency_penalty' => prompt.frequency_penalty,
        'user' => input_object.user.id
      }.to_json
    end
  end
end
