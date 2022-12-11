class CompletionRequestRunner

  def for(task_run_id, prompt_id, procedure = nil, response_handler = CompletionResponseHandler.new)
    task_run = TaskRun.find(task_run_id)
    prompt   = procedure ? Step::Prompt.find(prompt_id) : Prompt.find(prompt_id)

    request, config = assemble_request(task_run, prompt)

    response = execute_request!(request, config)
    response_handler.run(task_run, response, prompt, request, config, procedure)
  end

  private

  def assemble_request(task_run, prompt)
    RequestAssemblers::Coordinate.for(prompt, task_run.input_object, task_run.mock_request)
  end

  def execute_request!(request, config)
    log_request(request)
    client = client_for(config)
    client.run_request!(request, config)
  end

  def log_request(request)
    puts "Request initiated: #{request}"
  end

  def client_for(config)
    "ApiClients::#{config[:client_name]}".constantize.new
  end
end
