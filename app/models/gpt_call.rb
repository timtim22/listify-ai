class GptCall
  attr_reader :request, :config, :client

  def initialize(request_object, request_config)
    @request = request_object
    @config  = request_config
    @client  = GptClient.new
  end

  def execute!
    if config[:model]
      response = client.request_with_model(request)
    else
      response = client.request_with_text(request, config[:engine])
    end
  end
end
