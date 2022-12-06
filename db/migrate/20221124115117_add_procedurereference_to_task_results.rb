class AddProcedurereferenceToTaskResults < ActiveRecord::Migration[6.1]
  def change
    add_reference :task_results, :procedure
  end
end
