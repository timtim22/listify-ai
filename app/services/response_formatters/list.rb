module ResponseFormatters
  class List
    class << self
      def format(text)
        # its possible this could not run if the request takes too long (no guard to not show results)
        stripped_text = text.strip.gsub('Google Ad headline: ', '')
        raw_lines = stripped_text.split("\r\n").compact_blank
        consolidated_lines = consolidate_lines(raw_lines)
        formatted_lines = format_lines_with_numbers(consolidated_lines)
        last_line = formatted_lines.pop
        formatted_lines << strip_incomplete_last_line(last_line)
        formatted_lines.join("\r\n\r\n")
      end

      private

      def format_lines_with_numbers(lines)
        lines.map.with_index do |line, index|
          format_numbers(line, index + 1).gsub('"', '')
        end
      end

      def strip_incomplete_last_line(line)
        if line.ends_with?('.') || line.ends_with?('!')
          line
        else
          last_index = line.rindex(/(\.|\!)/)
          last_index > 2 ? line[0..last_index] : line
        end
      end

      def consolidate_lines(lines)
        consolidated = []
        index = 0
        while index < lines.length
          line = lines[index]
          if just_bullet?(line)
            consolidated << [line, lines[index + 1]].join
            index += 2
          else
            consolidated << line
            index += 1
          end
        end
        consolidated
      end

      def just_bullet?(line)
        /\d(\.|\))\s?$/.match? line
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

