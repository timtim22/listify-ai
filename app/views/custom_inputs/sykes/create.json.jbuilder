json.sykes_obj do
  json.id @sykes_obj.id
  json.request_type @sykes_obj.request_type
end

json.runs_remaining @runs_remaining

json.partial! 'task_runs/task_run', task_run: @task_run
