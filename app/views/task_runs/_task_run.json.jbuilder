json.task_run do
  json.id @task_run.id
end

json.task_results(
  @task_run.task_results,
  partial: 'task_results/task_result',
  as: :task_result
)
