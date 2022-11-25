module RequestAssemblers
  class Input
    def self.prompt(input_text, input_object)
      begin
        input_object.input_text
      rescue
        input_object
      end
      input_text.gsub('{input}', input_text)
    end
  end
end
