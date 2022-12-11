module ResponseFormatters
  class Whitespace
    class << self
      def format(text)
        new_text = text.strip
        if new_text.first == '"' && new_text.last == '"'
          new_text[1..-2]
        else
          new_text
        end
      end
    end
  end
end
