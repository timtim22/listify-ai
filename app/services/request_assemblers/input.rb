module RequestAssemblers
  class Input
    def self.prompt(input_text, input_object)
      input_text.gsub('{input}', input_object.input_text)
    end
  end
end
