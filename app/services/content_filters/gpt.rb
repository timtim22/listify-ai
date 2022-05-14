module ContentFilters
  class Gpt
    PASS            = 'pass'.freeze
    FAIL            = 'fail'.freeze
    TOXIC_THRESHOLD = -0.355

    def self.run_for!(result_hash, client = ApiClients::Gpt.new)
      filter_response = run_filter_check(result_hash, client)
      result_for(filter_response)
    end

    private

    def self.run_filter_check(result_hash, client)
      params = params_for_filter_request(result_hash)
      client.request_content_filter(params)
    end

    def self.result_for(filter_response)
      if filter_response[:error]
        filter_response
      else
        label = decide_label(filter_response)
        {
          decision: safe_outcome?(label) ? PASS : FAIL,
          label: label,
          data: filter_response.to_json
        }
      end
    end

    def self.decide_label(filter_response)
      first_choice = filter_response['choices'][0]['text']
      if first_choice != '2'
        first_choice
      else
        decide_on_confidence(filter_response)
      end
    end

    def self.decide_on_confidence(filter_response)
      logprobs = filter_response['choices'][0]['logprobs']['top_logprobs'][0]
      if logprobs['2'] > TOXIC_THRESHOLD
        '2'
      elsif logprobs['0'] && logprobs['0'] > logprobs['2']
        '0'
      elsif logprobs['1'] && logprobs['1'] > logprobs['2']
        '1'
      else
        '2'
      end
    end

    def self.safe_outcome?(label)
      ['0', '1'].include?(label.to_s)
    end

    def self.params_for_filter_request(result_hash)
      {
        'prompt' => prompt_content(result_hash),
        'temperature' => 0,
        'max_tokens' => 1,
        'top_p' => 0,
        'frequency_penalty' => 0,
        'presence_penalty' => 0,
        'logprobs' => 10,
        'user' => result_hash[:user_id]
      }.to_json
    end

    def self.prompt_content(result_hash)
      "<|endoftext|>#{result_hash[:result_text]}\n--\nLabel:"
    end
  end
end
