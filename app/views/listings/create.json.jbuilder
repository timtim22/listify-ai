json.listing do
  json.id @listing.id
  json.request_type @listing.request_type
end

json.task_run do
  json.id @task_run.id
end

json.task_results @task_run.task_results do |result|
  json.id result.id
  json.success result.success
  json.result_text result.result_text
  json.prompt_id result.prompt_id
  json.prompt_labels result.prompt.labels
end
