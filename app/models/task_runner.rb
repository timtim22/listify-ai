class TaskRunner

  def self.run_for!(input_object, user)
    prompt_set = prompt_set_for(input_object.request_type)
    task_run = create_task_run(user, prompt_set, input_object)

    prompt_set.prompts.map do |prompt|
      gpt_call = GptCallGenerator.generate_for(prompt, input_object)
      response = gpt_call.execute!
      #response = { success: true, result_text: 'successful response' }
      create_task_result(task_run, response, prompt)
    end
    task_run
  end

  def self.prompt_set_for(request_type)
    prompt_set = PromptSet.for(request_type)
    raise "No prompts for #{request_type}" if prompt_set.nil?
    prompt_set
  end

  def self.create_task_run(user, prompt_set, input_object)
    TaskRun.create!(
      user: user,
      prompt_set: prompt_set,
      input_object: input_object,
    )
  end

  def self.create_task_result(task_run, response, prompt)
    result = task_run.task_results.create!(
      prompt: prompt,
      success: response[:success],
      result_text: response[:result_text],
      error: response[:error]
    )
    if response[:check_result]
      create_filter_result(result, response[:check_result])
    end
  end

  def self.create_filter_result(result, filter_result)
    result.content_filter_results.create!(
      decision: filter_result[:decision],
      label: filter_result[:label],
      data: filter_result[:data],
    )
  end

end
