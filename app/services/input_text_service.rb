class InputTextService

  def initialize(input_text)
    @input_text = input_text
  end

  def call
    lines = @input_text.split("\n")
    if lines.first.include? 'studio'
      lines.first.sub!(/\d+ bedroom /, '')
      lines.join("\n")
    elsif lines.last.count("a-zA-Z").zero?
      @input_text.sub!(lines.last, '')
      new_line = @input_text.strip + "."
      new_line
    else
      @input_text
    end
  end
end
