json.room_description do
  json.id @room_description.id
  json.request_type @room_description.request_type
end

json.runs_remaining @runs_remaining

json.partial! @task_run, as: :task_run
