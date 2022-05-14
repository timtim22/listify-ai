module Translations
  class Runner
    def run(task_run, task_result, client = ApiClients::DeepL.new)
      task_run.translation_requests.each do |req|
        response = client.translate(req.from, req.to, task_result.result_text)
        Translation.create_for!(task_result, response)
      end
    end
  end
end
