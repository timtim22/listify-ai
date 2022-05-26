module Taggers
  class Coordinate
    class << self
      def for(request_type, attributes)
        tagger = tagger_for(request_type)
        temp_obj = OpenStruct.new(attributes)
        {
          tags: tagger.tags_for(temp_obj),
          prompt: tagger.prompt_for(temp_obj)
        }
      end

      def tagger_for(_request_type)
        Taggers::OyoOne.new
      end
    end
  end
end
