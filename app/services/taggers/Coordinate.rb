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

      def tagger_for(request_type)
        case request_type
        when 'oyo_one' then Taggers::OyoOne.new
        when 'oyo_two' then Taggers::OyoTwo.new
        when 'oyo_three' then Taggers::OyoThree.new
        when 'sykes_middle' then Taggers::SykesMiddle.new
        when 'vacasa_one' then Taggers::VacasaOne.new
        when 'vacasa_two' then Taggers::VacasaTwo.new
        when 'vacasa_three' then Taggers::VacasaThree.new
        else
          raise "Error in Taggers::Coordinate - Request Type #{request_type} missing!"
        end
      end
    end
  end
end
