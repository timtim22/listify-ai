module RequestAssemblers
  class CustomInput
    class << self
      def prompt(prompt_text, input_object)
        examples = ExamplePickers::OyoOne.call(input_object)
        prompt_text
          .gsub('{examples}', assemble_examples(examples))
          .gsub('{input}', input_object.input_text)
      end

      def assemble_examples(examples)
        prompt = examples.first(5).map do |example|
          "Features:\n#{individual_prompt(example.input_data)}\nSummary: #{example.completion}\n#{stop_sequence}"
        end
        prompt.join("\n\n")
      end

      def individual_prompt(data)
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

      def stop_sequence
        '###'
      end
    end
  end
end
