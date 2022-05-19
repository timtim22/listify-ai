class CompletionRequestRunner

  def for(task_run_id, prompt_id, response_handler = CompletionResponseHandler.new)
    task_run = TaskRun.find(task_run_id)
    prompt   = Prompt.find(prompt_id)
    response = execute_request!(prompt, task_run)
    response_handler.run(task_run, response, prompt)
  end

  private

  def execute_request!(prompt, task_run)
    request, config = RequestAssemblers::Coordinate.for(prompt, task_run.input_object)
    log_request(request)
    client = client_for(config)
    client.run_request!(request, config)
  end

  def log_request(request)
    puts 'REQUEST'
    puts request
    puts '-----'
  end

  def client_for(config)
    "ApiClients::#{config[:client_name]}".constantize.new
  end
end
