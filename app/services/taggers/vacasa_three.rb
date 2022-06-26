module Taggers
  class VacasaThree
    def prompt_for(obj)
      obj.things_to_know
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'vacasa_three')
    end
  end
end
