json.object do
  json.id @object.id
  json.request_type @object.request_type
end

json.runs_remaining @runs_remaining

json.partial! 'task_runs/task_run', task_run: @task_run
