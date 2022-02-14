json.task_results do
  json.partial! 'listing_fragments/task_result', collection: @task_results, as: :task_result
end
json.result_type @result_type
