json.success @task_run.error.nil?
json.response_text @task_run.result_text.strip
json.original_text @task_run.input_text
json.original_length @task_run.input_text.length
