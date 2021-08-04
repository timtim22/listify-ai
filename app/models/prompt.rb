class Prompt
  TASK_TYPES = ["tidy_grammar", "bullet_list"].freeze

  def self.for(task_type, text)
    if TASK_TYPES.include?(task_type)
      self.method(task_type.to_sym).call(text)
    else
      raise "Unknown task type!"
    end
  end

  def self.tidy_grammar(text)
    OpenStruct.new(
      title: "tidy_grammar",
      body: "Convert the following text to standard British English:\n#{text}",
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def self.bullet_list(text)
    OpenStruct.new(
      title: "bullet_list",
      body: "Convert the following text into a list:\n#{text}",
      stop: "\\n",
      max_tokens: 200,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

end
