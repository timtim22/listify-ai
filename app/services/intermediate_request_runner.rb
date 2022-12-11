class IntermediateRequestRunner

  def for(task_run_id, step_prompt_id, input, intermediate_response_handler = IntermediateResponseHandler.new)
    task_run = TaskRun.find(task_run_id)
    prompt   = Step::Prompt.find(step_prompt_id)

    request, config = assemble_request(input, prompt)
    response = execute_request!(request, config)
    intermediate_response_handler.run(task_run, response, prompt)
  end

  private

  def assemble_request(input, prompt)
    RequestAssemblers::Coordinate.for(prompt, input)
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
