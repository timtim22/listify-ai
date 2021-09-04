class TaskRunner

  def self.run_for!(input_object, user)
    prompt_set = prompt_set_for(input_object.request_type)
    task_run = create_task_run(user, prompt_set, input_object)

    prompt_set.prompts.map do |prompt|
      prompt_for_client = prompt_object_from(prompt, input_object)
      #response = GptClient.new.execute_request(prompt_for_client)
      sleep(2)
      response = { success: true, result_text: 'successful response' }
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
    task_run.task_results.create!(
      prompt: prompt,
      success: response[:success],
      result_text: response[:result_text],
      error: response[:error]
    )
  end

  private

  def self.prompt_object_from(prompt, input_object)
    prompt_object = prompt.generate_with(input_object)
    log(prompt_object)
    prompt_object
  end

  def self.log(prompt)
    puts "PROMPT"
    puts prompt
    puts "-----"
  end
end
