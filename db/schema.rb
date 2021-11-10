# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2021_11_10_090825) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "area_descriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "search_location_id", null: false
    t.string "request_type"
    t.jsonb "input_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["search_location_id"], name: "index_area_descriptions_on_search_location_id"
  end

  create_table "content_filter_results", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_result_id", null: false
    t.string "decision"
    t.string "label"
    t.jsonb "data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_result_id"], name: "index_content_filter_results_on_task_result_id"
  end

  create_table "feedbacks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_run_id", null: false
    t.string "sentiment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_run_id"], name: "index_feedbacks_on_task_run_id"
  end

  create_table "inputs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "inputable_type", null: false
    t.uuid "inputable_id", null: false
    t.index ["user_id"], name: "index_inputs_on_user_id"
  end

  create_table "legacy_prompts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title", null: false
    t.text "content", null: false
    t.string "stop"
    t.float "temperature", null: false
    t.integer "max_tokens", default: 100
    t.float "top_p", null: false
    t.float "frequency_penalty", null: false
    t.float "presence_penalty", null: false
    t.string "engine", null: false
    t.boolean "active", default: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "gpt_model_id"
  end

  create_table "legacy_task_runs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "input_source"
    t.text "input_text"
    t.string "task_type"
    t.text "result_text"
    t.string "error"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "legacy_prompt_id"
    t.index ["legacy_prompt_id"], name: "index_legacy_task_runs_on_legacy_prompt_id"
    t.index ["user_id"], name: "index_legacy_task_runs_on_user_id"
  end

  create_table "listings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.string "property_type"
    t.integer "sleeps"
    t.string "location"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "playground_attempts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "prompt_sets", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "title"
    t.string "request_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "prompts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "prompt_set_id", null: false
    t.string "title", null: false
    t.text "content", null: false
    t.string "stop"
    t.float "temperature", null: false
    t.integer "max_tokens", default: 100
    t.float "top_p", null: false
    t.float "frequency_penalty", null: false
    t.float "presence_penalty", null: false
    t.string "engine", null: false
    t.string "gpt_model_id"
    t.integer "number_of_results", default: 1
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "labels"
    t.index ["prompt_set_id"], name: "index_prompts_on_prompt_set_id"
  end

  create_table "search_locations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "search_text"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "task_results", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_run_id", null: false
    t.uuid "prompt_id"
    t.boolean "success"
    t.string "result_text"
    t.string "error"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.boolean "failed_custom_filter", default: false
    t.boolean "user_copied", default: false
    t.index ["prompt_id"], name: "index_task_results_on_prompt_id"
    t.index ["task_run_id"], name: "index_task_results_on_task_run_id"
  end

  create_table "task_run_feedbacks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "task_run_id", null: false
    t.integer "score"
    t.text "comment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_run_id"], name: "index_task_run_feedbacks_on_task_run_id"
    t.index ["user_id"], name: "index_task_run_feedbacks_on_user_id"
  end

  create_table "task_runs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "prompt_set_id", null: false
    t.string "input_object_type"
    t.uuid "input_object_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "expected_results"
    t.index ["input_object_type", "input_object_id"], name: "index_task_runs_on_input_object"
    t.index ["prompt_set_id"], name: "index_task_runs_on_prompt_set_id"
    t.index ["user_id"], name: "index_task_runs_on_user_id"
  end

  create_table "text_results", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_run_id", null: false
    t.text "result_text"
    t.boolean "user_copied", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_run_id"], name: "index_text_results_on_task_run_id"
  end

  create_table "translation_requests", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "from", default: "en-gb"
    t.string "to"
    t.uuid "task_run_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_run_id"], name: "index_translation_requests_on_task_run_id"
  end

  create_table "translations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "translatable_type"
    t.uuid "translatable_id"
    t.string "from", null: false
    t.string "to", null: false
    t.text "result_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["translatable_type", "translatable_id"], name: "index_translations_on_translatable"
  end

  create_table "users", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.string "first_name"
    t.string "last_name"
    t.boolean "admin", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "custom_run_limit"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "writings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "area_descriptions", "search_locations"
  add_foreign_key "content_filter_results", "task_results"
  add_foreign_key "feedbacks", "legacy_task_runs", column: "task_run_id"
  add_foreign_key "inputs", "users"
  add_foreign_key "legacy_task_runs", "legacy_prompts"
  add_foreign_key "legacy_task_runs", "users"
  add_foreign_key "prompts", "prompt_sets"
  add_foreign_key "task_results", "prompts"
  add_foreign_key "task_results", "task_runs"
  add_foreign_key "task_run_feedbacks", "task_runs"
  add_foreign_key "task_run_feedbacks", "users"
  add_foreign_key "task_runs", "prompt_sets"
  add_foreign_key "task_runs", "users"
  add_foreign_key "text_results", "task_runs"
  add_foreign_key "translation_requests", "task_runs"
end
