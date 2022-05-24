module RequestAssemblers
  class Ai21

    def self.parameters(prompt, prompt_body, _input_object)
      {
        "prompt": prompt_body,
        "numResults": prompt.number_of_results,
        "maxTokens": prompt.max_tokens,
        "temperature": prompt.temperature,
        "topKReturn": 0,
        "topP": 1,
        "countPenalty": {
          "scale": 0,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "frequencyPenalty": {
          "scale": prompt.frequency_penalty,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "presencePenalty": {
          "scale": 0,
          "applyToNumbers": false,
          "applyToPunctuations": false,
          "applyToStopwords": false,
          "applyToWhitespaces": false,
          "applyToEmojis": false
        },
        "stopSequences": prompt.stop
      }.to_json
    end
  end
end
