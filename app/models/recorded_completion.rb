class RecordedCompletion < ApplicationRecord
  belongs_to :task_run, optional: true
  belongs_to :task_result, optional: true
  belongs_to :user, optional: true

  def self.create_for(task_run, task_result, request, config)
    input_object = task_run.input_object
    parsed_request = JSON.parse(request).symbolize_keys
    RecordedCompletion.create(
      user: task_run.user,
      task_run: task_run,
      task_result: task_result,
      task_run_created_at: task_run.created_at,
      input_object_type: task_run.input_object_type,
      input_text_snapshot: InputSnapshot.for(input_object),
      prompt_text: parsed_request[:prompt],
      completion_text: task_result.result_text,
      result_error: task_result.error,
      request_configuration: parsed_request.except(:prompt),
      request_type: input_object.request_type,
      api_client: config[:client_name],
      engine: config[:engine],
      remote_model_id: config[:model],
      prompt_title: config[:prompt_title],
      ran_content_filter: task_result.content_filter_results.any?,
      failed_filter: task_result.failed_any_filter?,
      input_language_code: input_object.respond_to?(:input_language) ? input_object.input_language : 'EN',
      untranslated_input_text: input_object.respond_to?(:untranslated_input_text) ? input_object.untranslated_input_text : nil,
      completion_translation_codes: task_result.translations.pluck(:to),
      api_request: task_run.api_request
    )
  end

  def self.update_translations!(task_result) # safe nav as if translation request, object may not exist yet 
    translation_codes = task_result.translations.pluck(:to)
    task_result&.recorded_completion&.update!(
      completion_translation_codes: translation_codes
    )
  end
end
