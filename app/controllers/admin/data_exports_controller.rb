class Admin::DataExportsController < ApplicationController
  before_action :authenticate_admin

  def index
    model_types = %w[RoomDescription Inputs::BedroomFragment Inputs::OtherRoomFragment]
    task_runs = TaskRun.where(input_object_type: model_types).includes(:task_results)
    headers = %w[task_run_id created_at input_object_type prompt completion]
    full_csv = CSV.generate(headers: true) do |csv|
      csv << headers

      task_runs.each do |t|
        csv << [t.id, t.created_at, t.input_object_type, t.input_object.input_text, t.task_results.first.result_text]
      end
    end
    respond_to do |format|
      format.html
      format.csv { send_data full_csv }
    end
  end
end
