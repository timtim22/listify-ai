json.obj do
  json.id @obj.id
  json.request_type @obj.request_type
end

json.runs_remaining @runs_remaining

json.partial! 'task_runs/task_run', task_run: @task_run
