class Prompt

  def self.correct_grammar(text)
    OpenStruct.new(
      title: "grammar",
      body: "Convert the following text to standard British English:\n#{text}",
      stop: "\\n",
      max_tokens: 100,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

  def self.draft_email(text)
    OpenStruct.new(
      title: "grammar",
      body: "Write this email in standard British English:\n#{text}",
      stop: "\\n",
      max_tokens: 100,
      temperature: 0.0,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      engine: "davinci-instruct-beta"
    )
  end

end
