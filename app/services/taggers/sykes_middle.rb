module Taggers
  class SykesMiddle
    def prompt_for(obj)
      obj.key_features
    end

    def tags_for(obj)
      Taggers::CommonMethods.tags_for(obj, 'sykes_middle')
    end
  end
end

