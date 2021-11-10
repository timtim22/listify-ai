class TaskRunner

  def run_for!(input_object, user, output_language = nil)
    prompt_set = prompt_set_for(input_object.request_type)
    task_run   = create_task_run(user, prompt_set, input_object, output_language)

    generate_gpt_results(task_run, prompt_set)
    generate_text_results(task_run, input_object)
    task_run
  end

  def generate_gpt_results(task_run, prompt_set)
    prompt_set.prompts.map do |prompt|
      GptResultWorker.perform_async(task_run.id, prompt.id)
    end
  end

  def generate_text_results(task_run, input_object)
    if input_object.class.to_s == "AreaDescription"
      AreaDescription::Generator.run!(task_run, input_object)
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
    if output_language
      task_run.translation_requests.create_for!(output_language)
    end
  end
end
