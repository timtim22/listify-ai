module ResponseFormatters
  class List
    class << self
      def format(text)
        # its possible this could not run if the request takes too long (no guard to not show results)
        stripped_text = text.strip.gsub('Google Ad headline: ', '')
        lines = stripped_text.split("\r\n").compact_blank
        formatted_lines = lines.map.with_index do |line, index|
          format_numbers(line, index + 1).gsub('"', '')
        end
        formatted_lines.join("\r\n\r\n")
      end

      private

      def format_numbers(line, number)
        numbered = if line.starts_with? "#{number}."
          line
        elsif line.starts_with? "#{number})"
          line.sub(')', '.')
        else
          "#{number}. #{line}"
        end
        numbered[2] == ' ' ? numbered : numbered.insert(2, ' ')
      end
    end
  end
end

