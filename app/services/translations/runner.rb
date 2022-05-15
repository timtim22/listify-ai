module Translations
  class Runner
    def run(task_run, task_result, client = ApiClients::DeepL.new)
      task_run.translation_requests.each do |req|
        response = client.translate(req.from, req.to, task_result.result_text)
        Translation.create_for!(task_result, response)
      end
    end

    def request_in_english(language, input_text)
      if language.present? && language != 'EN'
        translation = translate_to_english!(language, input_text)
        {
          input_language: language,
          untranslated_input_text: input_text,
          input_text: translation[:error] ? '' : translation[:text]
        }
      else
        {}
      end
    end

    private

    def translate_to_english!(language, input_text)
      ApiClients::DeepL.new.translate(language, 'EN-GB', input_text)
    end
  end
end
