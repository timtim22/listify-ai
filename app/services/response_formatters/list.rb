module ResponseFormatters
  class List
    class << self
      def format(text)
        # its possible this could not run if the request takes too long (no guard to not show results)
        stripped_text = text.strip.gsub('Google Ad headline: ', '')
        raw_lines = stripped_text.split("\r\n").compact_blank
        consolidated_lines = consolidate_lines(raw_lines)
        formatted_lines = consolidated_lines.map.with_index do |line, index|
          format_numbers(line, index + 1).gsub('"', '')
        end
        formatted_lines.join("\r\n\r\n")
      end

      private

      def consolidate_lines(lines)
        consolidated = []
        index = 0
        while index < lines.length
          line = lines[index]
          if /\d(\.|\))\s?$/.match? line
            consolidated << [line, lines[index + 1]].join
            index += 2
          else
            consolidated << line
            index += 1
          end
        end
        consolidated
      end

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

