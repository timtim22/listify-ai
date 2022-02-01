json.listing_fragment do
  json.id @listing_fragment.id
  json.request_type @listing_fragment.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
