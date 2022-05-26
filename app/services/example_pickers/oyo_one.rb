module ExamplePickers
  class OyoOne
    class << self

      def call(input_object)
        select_top_matches(input_object)
      end

      def select_top_matches(input_object)
        examples_with_matches(input_object)
          .sort_by { |w| w.matches.length }
          .reverse
          .sample(4)
          .map(&:example)
      end

      def examples_with_matches(input_object)
        examples = Example.where(request_type: 'oyo_one')

        examples.map do |example|
          matches = example.tags.intersection(input_object.tags)
          OpenStruct.new(matches: matches, example: example)
        end
      end
    end
  end
end
