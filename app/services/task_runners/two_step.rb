class TaskRunners::TwoStep
  def run_for!(input_object, user, output_language = nil)
    second_request_type = 'room_step_2'

    prompt_set   = prompt_set_for(input_object.request_type)
    task_run     = create_task_run(user, prompt_set, input_object, output_language)
    second_input = Input.create_with(DerivedInputObject.new(request_type: second_request_type), user).input_object
    prompt_set_2 = prompt_set_for(second_request_type)
    task_run_2   = create_task_run(user, prompt_set_2, second_input, output_language)

    generate_gpt_results(task_run, prompt_set, task_run_2, prompt_set_2)

    task_run_2
  end

  def generate_gpt_results(task_run, prompt_set, task_run_2, prompt_set_2)
    prompt_set.prompts.map do |prompt|
      GptTwoStepResultWorker.perform_async(task_run.id, prompt.id, task_run_2.id, prompt_set_2.id)
    end
  end

  def prompt_set_for(request_type)
    prompt_set = PromptSet.for(request_type)
    raise "No prompts for #{request_type}" if prompt_set.nil?
    prompt_set
  end

  def create_task_run(user, prompt_set, input_object, output_language)
    task_run = TaskRun.create!(
      user: user,
      prompt_set: prompt_set,
      input_object: input_object,
      expected_results: prompt_set.prompts.count
    )
    create_translation_request(task_run, output_language)
    task_run
  end

  def create_translation_request(task_run, output_language)
    if output_language && output_language != "EN"
      task_run.translation_requests.create_for!(output_language)
    end
  end
end
