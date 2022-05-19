json.oyo_one do
  json.id @oyo_one.id
  json.request_type @oyo_one.request_type
end

json.runs_remaining @runs_remaining

json.partial! 'task_runs/task_run', task_run: @task_run
