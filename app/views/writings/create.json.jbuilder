json.writing do
  json.id @writing.id
  json.request_type @writing.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
