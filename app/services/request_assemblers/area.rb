module RequestAssemblers
  class Area
    def self.prompt(input_text, input_object)
      input_text
        .gsub('{input}', input_object.input_text)
        .gsub('{area}', input_object.location.titleize)
    end
  end
end
