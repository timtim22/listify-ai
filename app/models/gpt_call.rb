class GptCall
  attr_reader :request, :config, :client

  def initialize(request_object, request_config)
    @request = request_object
    @config  = request_config
    @client  = ApiClients::Gpt.new
  end

  def execute!
    log_request
    response = execute_request
    result_from(response)
  end

  private

  def execute_request
    if config[:model].present?
      client.request_with_model(request)
    else
      client.request_with_text(request, config[:engine])
    end
  end

  def result_from(response)
    if response[:error]
      response
    else
      {
        success: true,
        result_text: result_text(response),
        user_id: JSON.parse(request)['user'],
        should_check_content: config[:check_content]
      }
    end
  end

  def result_text(response)
    response['choices'].first['text']
  end

  def log_request
    puts 'REQUEST'
    puts request
    puts '-----'
  end
end
