json.area_description do
  json.id @area_description.id
  json.request_type @area_description.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
