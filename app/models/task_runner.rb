class TaskRunner
  attr_reader :unsafe_result

  def initialize
    @unsafe_result = false
  end

  def run_for!(input_object, user)
    prompt_set = prompt_set_for(input_object.request_type)
    task_run = create_task_run(user, prompt_set, input_object)

    prompt_set.prompts.map do |prompt|
      if !unsafe_result
        gpt_call = GptCallGenerator.generate_for(prompt, input_object)
        response = gpt_call.execute!
        #response = { check_result: { decision: "fail", label: "1", data: "" }, success: true, result_text: 'test' }
        #sleep(4)
        create_task_result(task_run, response, prompt)
      end
    end
    task_run
  end

  def prompt_set_for(request_type)
    prompt_set = PromptSet.for(request_type)
    raise "No prompts for #{request_type}" if prompt_set.nil?
    prompt_set
  end

  def create_task_run(user, prompt_set, input_object)
    TaskRun.create!(
      user: user,
      prompt_set: prompt_set,
      input_object: input_object,
    )
  end

  def create_task_result(task_run, response, prompt)
    result = task_run.task_results.create!(
      prompt: prompt,
      success: response[:success],
      result_text: response[:result_text],
      error: response[:error]
    )
    if response[:check_result]
      filter_result = create_filter_result(result, response[:check_result])
      flag_result(filter_result)
    end
  end

  def create_filter_result(result, filter_result)
    result.content_filter_results.create!(
      decision: filter_result[:decision],
      label: filter_result[:label],
      data: filter_result[:data],
    )
  end

  def flag_result(filter_result)
    if filter_result.label != "0"
      @unsafe_result = true
    end
  end
end
