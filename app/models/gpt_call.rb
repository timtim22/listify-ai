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
    if response[:success] && config[:check_content]
      GptCheckedResponse.for(response, client)
    else
      response
    end
  end

  private

  def execute_request
    if config[:model].present?
      response = client.request_with_model(request)
    else
      response = client.request_with_text(request, config[:engine])
    end
    result_from(response)
  end

  def result_from(response)
    if response[:error]
      response
    else
      {
        success: true,
        result_text: result_text(response),
        user_id: JSON.parse(request)["user"]
      }
    end
  end

  def result_text(response)
    response["choices"].first.dig("text")
  end

  def log_request
    puts "REQUEST"
    puts request
    puts "-----"
  end
end
