json.playground_attempt do
  json.id @playground_attempt.id
  json.request_type @playground_attempt.request_type
end

json.partial! @task_run, as: :task_run
