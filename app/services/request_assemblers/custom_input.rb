module RequestAssemblers
  class CustomInput
    class << self
      def prompt(prompt_text, input_object)
        examples = ExamplePickers::Basic.call(input_object)
        prompt_text
          .gsub('{examples}', assemble_examples(examples))
          .gsub('{input}', formatted_input(input_object.input_text))
      end

      def formatted_input(input_text)
        "Features:\n#{input_text}\nSummary:"
      end

      def assemble_examples(examples)
        tagger = Taggers::Coordinate.tagger_for(examples.first.request_type)
        prompt = examples.first(5).map do |example|
          "Features:\n#{individual_prompt(example.input_data, tagger)}\nSummary: #{example.completion}\n#{stop_sequence}"
        end
        prompt.join("\n\n")
      end

      def individual_prompt(data, tagger)
        obj = OpenStruct.new(data)
        tagger.prompt_for(obj)
      end

      def stop_sequence
        '###'
      end
    end
  end
end
