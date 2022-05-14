module RequestAssemblers
  class Brand
    def self.prompt(input_text, input_object)
      input_text
        .gsub('{input}', input_object.input_text)
        .gsub('{area}', input_object.location.titleize)
        .gsub('{brand_name}', input_object.brand_name.titleize)
    end
  end
end
