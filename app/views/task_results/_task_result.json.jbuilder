json.id task_result.id
json.success task_result.success
json.result_text task_result.filtered_result_text
json.prompt_id task_result.prompt_id
json.prompt_labels task_result.prompt.labels
json.completion_id task_result&.recorded_completion&.id
json.translations do
  json.partial! 'translations/translation', collection: task_result.translations, as: :translation
end
