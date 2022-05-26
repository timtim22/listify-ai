require 'csv'

module CsvImporters
  class Example

    CSV_NAME = 'oyo_apt_1.csv'
    INPUT_STRUCTURE = 'oyo_one'

    class << self
      def import!
        rows = import_rows
        rows.each { |row| create_record!(row) }
      end

      def import_rows
        rows = []
        CSV.foreach(CSV_NAME, headers: true) do |row|
          if row['Property type'] && row['target user']
            fields = fields_for(row)
            rows << fields
          end
        end
        rows
      end

      def fields_for(row)
        {
          manual_prompt: row['PROMPT'],
          property_type: row['Property type'],
          location: row['Location'],
          location_detail: row['Location detail'],
          target_user: row['target user'],
          usp_one: row['USP1'],
          usp_two: row['USP2'],
          usp_three: row['USP3'],
          completion: row['COMPLETION']
        }
      end

      def construct_prompt(data)
        obj = OpenStruct.new(data)
        strings = [
          "#{obj.property_type}#{obj.location && " in #{obj.location}"}",
          obj.location_detail,
          "ideal for #{obj.target_user}",
          obj.usp_one,
          obj.usp_two,
          obj.usp_three
        ].compact_blank

        "- #{strings.join("\n- ")}"
      end

      def create_record!(fields)
        if ::Example.find_by(completion: fields[:completion])
          puts "Skipped #{fields[:completion][0..50]}..."
        else
          example = ::Example.create!(
            input_data: fields.except(:completion),
            prompt: construct_prompt(fields),
            completion: fields[:completion],
            input_structure: INPUT_STRUCTURE
          )
          tag_example(example)
        end
      end

      def tag_example(example)
        data = Taggers::Coordinate.for(example.input_structure, example.input_data)
        example.update!(tags: data[:tags], prompt: data[:prompt])
      end
    end
  end
end

