json.playground_attempt do
  json.id @playground_attempt.id
  json.request_type @playground_attempt.request_type
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
