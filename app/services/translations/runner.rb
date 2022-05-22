module Translations
  class Runner
    def run(task_run, task_result)
      task_run.translation_requests.each do |req|
        Translation.fetch_new!(req.to, task_result)
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
