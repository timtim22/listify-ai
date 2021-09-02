class TaskRunner

  def self.run_for!(input_object)

    prompt = Prompt.for(input_object.task_type)
    prompt_with_query = generate_prompt_with_query(prompt, input_object.input_text)
    response = GptClient.new.execute_request(prompt_with_query)

    task_run = TaskRun.create!(
      task_type: task_type,
      prompt: prompt,
      input_object: input_object,
      error: response[:error],
      user: input_object.user
    )
    if task_run.error.nil?
      task_run.create_results!(response)
    end
    task_run

  end

  def self.run_for_legacy!(typed_text, recording, task_type)
    input_text = typed_text || TextFromSpeech.new.from(recording)

    if input_too_short?(input_text)
      raise Errors::ShortRequest
    end

    prompt = LegacyPrompt.for(task_type)
    if task_type == "transcription"
      response = { result_text: input_text, success: true }
    else
      prompt_with_query = generate_prompt_with_query(prompt, input_text)
      response = GptClient.new.execute_request(prompt_with_query)
    end

    task_run = LegacyTaskRun.create!(
      task_type: task_type,
      legacy_prompt: prompt,
      input_source: typed_text ? 'text' : 'recording',
      input_text: input_text,
      result_text: response[:result_text],
      error: response[:error],
      user: User.first
    )
    task_run
  end

  private

  def self.generate_prompt_with_query(prompt, input_text)
    if prompt.nil?
      raise "Unknown task type!"
    elsif prompt.gpt_model_id.present?
      prompt_with_query = prompt.to_object_with_model(input_text)
      log(prompt_with_query)
      prompt_with_query
    else
      prompt_with_query = prompt.to_object_with_text(input_text)
      log(prompt_with_query)
      prompt_with_query
    end
  end

  def self.input_too_short?(input_text)
    input_text.split(" ").length <= 5
  end

  def self.log(prompt)
    puts "PROMPT"
    puts prompt
    puts "-----"
  end
end
