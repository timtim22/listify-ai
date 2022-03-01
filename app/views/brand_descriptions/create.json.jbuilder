json.brand_description do
  json.id @brand_description.id
  json.request_type @brand_description.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
