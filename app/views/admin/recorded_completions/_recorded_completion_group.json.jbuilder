json.grouped_completions(@completions_by_task_run) do |group|
  first_record = group.last.first
  json.task_run_timestamp group.first
  json.task_run_id first_record.task_run_id
  json.request_type first_record.request_type
  json.user_email first_record.user.email
  json.user_id first_record.user.id
  json.user_input first_record.input_text_snapshot
  json.untranslated_input first_record.untranslated_input_text
  json.input_language_code first_record.input_language_code
  json.completions(group.last) do |completion|
    json.id completion.id
    json.task_result_id completion.task_result_id
    json.api_client completion.api_client
    json.prompt_title completion.prompt_title
    json.completion_text completion.completion_text
    json.result_error completion.result_error
    json.ran_content_filter completion.ran_content_filter
    json.failed_filter completion.failed_filter
    json.completion_copied completion.completion_copied
    json.completion_translation_codes completion.completion_translation_codes
    json.api_request completion.api_request
  end
end
