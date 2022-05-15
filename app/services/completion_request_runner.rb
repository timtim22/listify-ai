class CompletionRequestRunner

  def for(task_run_id, prompt_id, response_handler = CompletionResponseHandler.new)
    task_run = TaskRun.find(task_run_id)
    prompt   = Prompt.find(prompt_id)
    response = execute_request!(prompt, task_run)
    response_handler.run(task_run, response, prompt)
  end

  private

  def execute_request!(prompt, task_run)
    if Rails.env.production? || ENV['LIVE_REQUESTS']
      request, config = RequestAssemblers::Coordinate.for(prompt, task_run.input_object)
      log_request(request)
      client = client_for(config)
      response = client.request_for(request, config)
      result_from(request, config, response)
    else
      mock_response(prompt)
      # mock_error_response
    end
  end

  def log_request(request)
    puts 'REQUEST'
    puts request
    puts '-----'
  end

  def client_for(config)
    "ApiClients::#{config[:client_name]}".constantize.new
  end

  def result_from(request, config, response)
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

  def mock_response(prompt)
    text = "This is a mock #{prompt.prompt_set.request_type.upcase} response in development mode, advertising a wonderful stay in a 3 bed house in Malaga."
    {
      check_result: { decision: 'pass', label: '0', data: '' },
      success: true,
      result_text: "#{text} #{text}"
    }
  end

  def mock_error_response
    {
      success: false,
      error: "{\n  \"error\": {\n    \"message\": \"The server is currently overloaded with other requests. Sorry about that! You can retry your request, or contact support@openai.com if the error persists.\",\n    \"type\": \"server_error\",\n    \"param\": null,\n    \"code\": null\n  }\n}\n"
    }
  end
end
