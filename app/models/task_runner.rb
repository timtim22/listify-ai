class TaskRunner

  def self.run_for!(typed_text, recording, task_type)
    input_text = typed_text || TextFromSpeech.new.from(recording)
    prompt     = Prompt.for(task_type, input_text)
    log(prompt)

    response   = GptClient.new.execute_request(prompt)

    task = Task.create!(
      task_type: task_type,
      input_text: input_text,
      result_text: response[:result_text],
      error: response[:error],
      user: User.first
    )
    task
  end

  def self.log(prompt)
    puts "PROMPT"
    puts prompt
    puts "-----"
  end
end
