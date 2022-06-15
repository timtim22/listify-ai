module Taggers
  class VacasaOne
    def prompt_for(obj)
      obj.key_features
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'vacasa_one')
    end
  end
end

