json.advert do
  json.id @advert.id
  json.request_type @advert.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
