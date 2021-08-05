json.success @task.error.nil?
json.response_text @task.result_text.strip
json.original_text @task.input_text
json.original_length @task.input_text.length
