json.listing do
  json.id @listing.id
  json.request_type @listing.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
