module Taggers
  class VacasaTwo
    def prompt_for(obj)
      obj.things_nearby
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'vacasa_two')
    end
  end
end


