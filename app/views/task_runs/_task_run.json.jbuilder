json.task_run do
  json.id @task_run.id
  json.text_results @task_run.text_results
  json.expected_results @task_run.expected_results
  json.is_rerun !!(defined?(locals) && locals[:is_rerun])
end
