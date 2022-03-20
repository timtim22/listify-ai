class TaskRunners::TwoStep
  def run_for!(input_object, user, second_request_type, output_language = nil)

    prompt_set   = prompt_set_for(input_object.request_type)
    task_run     = create_task_run(user, prompt_set, input_object, output_language)
    second_input = Input.create_with(DerivedInputObject.new(request_type: second_request_type), user).input_object
    prompt_set_2 = prompt_set_for(second_request_type)
    task_run_2   = create_task_run(user, prompt_set_2, second_input, output_language, task_run.id)

    generate_gpt_results(input_object, task_run, prompt_set, task_run_2, prompt_set_2)

    task_run_2
  end

  def generate_gpt_results(input_object, task_run, prompt_set, task_run_2, prompt_set_2)
    step_one_prompt = prompt_set.prompts.first
    if input_object.request_type == 'room_step_1_text'
      result_text = first_step_result_text(input_object)
      first_result = create_first_result(task_run, prompt_set, result_text)
      task_run_2.input_object.update(input_text: first_result.result_text&.strip) # if no error
      prompt_set_2.prompts.map do |prompt|
        GptRequestWorker.perform_async(task_run_2.id, prompt.id)
      end
    else
      GptTwoStepRequestWorker.perform_async(
        task_run.id,
        step_one_prompt.id,
        task_run_2.id,
        prompt_set_2.id
      )
    end
  end

  def create_first_result(task_run, prompt_set, result_text)
    task_run.task_results.create!(
      success: true,
      prompt: prompt_set.prompts.first,
      result_text: result_text
    )
  end

  def first_step_result_text(input_object)
    ordered_beds = ['super king bed', 'king bed', 'queen bed', 'double bed', 'single bed', 'twin beds']
    beds = input_object.input_text.split("\n").map { |e| e.split(':').last.strip }
    tallied = beds.tally

    ordered_results = []
    ordered_beds.each do |bed_type|
      if tallied[bed_type]
        s = tallied[bed_type] > 1 ? 's' : ''
        ordered_results << "#{tallied[bed_type]} #{bed_type.gsub('beds', 'room').gsub('bed', 'room')}#{s}"
      end
    end
    tense = ordered_results.first.first == '1' ? 'is' : 'are'
    "There are #{beds.length} bedrooms. There #{tense} #{ordered_results.join(', ')}.".gsub('king', 'king-size')
  end

  def prompt_set_for(request_type)
    prompt_set = PromptSet.for(request_type)
    raise "No prompts for #{request_type}" if prompt_set.nil?
    prompt_set
  end

  def create_task_run(user, prompt_set, input_object, output_language, upstream_task_run_id = nil)
    task_run = TaskRun.create!(
      user: user,
      prompt_set: prompt_set,
      input_object: input_object,
      expected_results: prompt_set.prompts.count,
      upstream_task_run_id: upstream_task_run_id
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
