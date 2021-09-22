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
        GptResultWorker.perform_async(task_run.id, prompt.id)
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
      expected_results: prompt_set.prompts.count
    )
  end

  def flag_result(filter_result)
    if filter_result.label != "0"
      @unsafe_result = true
    end
  end
end
