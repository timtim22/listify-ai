class TaskRunner

  def self.run_for!(typed_text, recording, task_type)
    input_text = typed_text || TextFromSpeech.new.from(recording)
    prompt     = Prompt.for(task_type)
    raise "Unknown task type!" if prompt.nil?

    prompt_with_query = prompt.to_object_with(input_text)

    log(prompt_with_query)

    #binding.pry

    if input_too_short?(input_text)
      raise Errors::ShortRequest
    else
      response = GptClient.new.execute_request(prompt_with_query)
      #response = { result_text: input_text, success: true }
    end

    task_run = TaskRun.create!(
      task_type: task_type,
      prompt: prompt,
      input_source: typed_text ? 'text' : 'recording',
      input_text: input_text,
      result_text: response[:result_text],
      error: response[:error],
      user: User.first
    )
    task_run
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
