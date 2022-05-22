class CreateRecordedCompletions < ActiveRecord::Migration[6.1]
  def change
    create_table :recorded_completions, id: :uuid do |t|
      t.references :task_run, foreign_key: true, type: :uuid
      t.references :task_result, foreign_key: true, type: :uuid
      t.references :user, foreign_key: true, type: :uuid
      t.datetime :task_run_created_at
      t.string :input_object_type
      t.text :input_text_snapshot
      t.text :prompt_text
      t.text :completion_text
      t.string :result_error
      t.jsonb :request_configuration
      t.string :request_type
      t.string :api_client
      t.string :engine
      t.string :remote_model_id
      t.string :prompt_title
      t.boolean :ran_content_filter, default: false
      t.boolean :failed_filter, default: false
      t.boolean :completion_copied, default: false
      t.string :completion_translation_codes, array: true, default: []
      t.string :input_language_code
      t.text :untranslated_input_text
      t.timestamps
    end
  end
end
