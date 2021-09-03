json.listing do
  json.id @listing.id
  json.request_type @listing.request_type
end

json.task_run do
  json.id @task_run.id
end

json.task_results @task_run.task_results,
  :id, :success, :result_text, :error, :prompt_id
