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

ActiveRecord::Schema.define(version: 2022_05_26_073219) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "pgcrypto"
  enable_extension "plpgsql"

  create_table "adverts", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.text "untranslated_input_text"
    t.string "input_language", default: "EN"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "area_description_fragments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "search_location_id", null: false
    t.string "request_type"
    t.text "detail_text"
    t.jsonb "input_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["search_location_id"], name: "index_area_description_fragments_on_search_location_id"
  end

  create_table "area_descriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "search_location_id", null: false
    t.string "request_type"
    t.jsonb "input_data"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.text "detail_text"
    t.index ["search_location_id"], name: "index_area_descriptions_on_search_location_id"
  end

  create_table "bedroom_fragments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "input_text"
    t.string "request_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "brand_descriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.string "brand_name"
    t.text "brand_details"
    t.text "property_details"
    t.string "location"
    t.text "location_details"
    t.string "attractions", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "charges", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "stripe_id"
    t.integer "amount"
    t.integer "amount_refunded"
    t.string "card_brand"
    t.string "card_last4"
    t.string "card_exp_month"
    t.string "card_exp_year"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_charges_on_user_id"
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

  create_table "custom_inputs_oyo_ones", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.string "input_text"
    t.string "property_type"
    t.string "target_user"
    t.string "location"
    t.string "location_detail"
    t.string "usp_one"
    t.string "usp_two"
    t.string "usp_three"
    t.string "tags", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "derived_input_objects", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "examples", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "input_structure"
    t.jsonb "input_data"
    t.text "prompt"
    t.text "completion", null: false
    t.string "tags", default: [], array: true
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "request_type"
  end

  create_table "feedbacks", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_run_id", null: false
    t.string "sentiment"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_run_id"], name: "index_feedbacks_on_task_run_id"
  end

  create_table "full_listings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.boolean "requests_completed", default: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.uuid "user_id"
    t.string "task_run_ids", default: [], array: true
    t.index ["user_id"], name: "index_full_listings_on_user_id"
  end

  create_table "generic_inputs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
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

  create_table "listing_fragments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "full_listing_id", null: false
    t.text "input_text"
    t.string "request_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["full_listing_id"], name: "index_listing_fragments_on_full_listing_id"
  end

  create_table "listings", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "request_type"
    t.text "input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "input_language", default: "EN"
    t.text "untranslated_input_text"
  end

  create_table "other_room_fragments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "input_text"
    t.string "request_type"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "plans", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "amount"
    t.string "interval"
    t.string "stripe_id"
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
    t.string "remote_model_id"
    t.integer "number_of_results", default: 1
    t.integer "position"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "labels"
    t.string "service"
    t.index ["prompt_set_id"], name: "index_prompts_on_prompt_set_id"
  end

  create_table "recorded_completions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "task_run_id"
    t.uuid "task_result_id"
    t.uuid "user_id"
    t.datetime "task_run_created_at"
    t.string "input_object_type"
    t.text "input_text_snapshot"
    t.text "prompt_text"
    t.text "completion_text"
    t.string "result_error"
    t.jsonb "request_configuration"
    t.string "request_type"
    t.string "api_client"
    t.string "engine"
    t.string "remote_model_id"
    t.string "prompt_title"
    t.boolean "ran_content_filter", default: false
    t.boolean "failed_filter", default: false
    t.boolean "completion_copied", default: false
    t.string "completion_translation_codes", default: [], array: true
    t.string "input_language_code"
    t.text "untranslated_input_text"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["task_result_id"], name: "index_recorded_completions_on_task_result_id"
    t.index ["task_run_id"], name: "index_recorded_completions_on_task_run_id"
    t.index ["user_id"], name: "index_recorded_completions_on_user_id"
  end

  create_table "recorded_searches", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "search_location_id", null: false
    t.uuid "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["search_location_id"], name: "index_recorded_searches_on_search_location_id"
    t.index ["user_id"], name: "index_recorded_searches_on_user_id"
  end

  create_table "room_descriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "input_text"
    t.string "request_type"
    t.string "room"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "search_locations", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "search_text"
    t.float "latitude"
    t.float "longitude"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "subscriptions", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.string "stripe_id"
    t.string "stripe_plan"
    t.string "status"
    t.datetime "trial_ends_at"
    t.datetime "ends_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["user_id"], name: "index_subscriptions_on_user_id"
  end

  create_table "summary_fragments", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.text "input_text"
    t.string "request_type"
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
    t.string "service"
    t.index ["prompt_id"], name: "index_task_results_on_prompt_id"
    t.index ["task_run_id"], name: "index_task_results_on_task_run_id"
  end

  create_table "task_runs", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "user_id", null: false
    t.uuid "prompt_set_id", null: false
    t.string "input_object_type"
    t.uuid "input_object_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "expected_results"
    t.string "upstream_task_run_id"
    t.index ["input_object_type", "input_object_id"], name: "index_task_runs_on_input_object"
    t.index ["prompt_set_id"], name: "index_task_runs_on_prompt_set_id"
    t.index ["user_id"], name: "index_task_runs_on_user_id"
  end

  create_table "team_roles", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.uuid "team_id", null: false
    t.uuid "user_id", null: false
    t.string "name", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["team_id"], name: "index_team_roles_on_team_id"
    t.index ["user_id"], name: "index_team_roles_on_user_id"
  end

  create_table "teams", id: :uuid, default: -> { "gen_random_uuid()" }, force: :cascade do |t|
    t.string "name"
    t.integer "custom_spin_count"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.integer "seat_count"
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
    t.string "from", default: "EN"
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
    t.boolean "success"
    t.text "result_text"
    t.string "error"
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
    t.string "stripe_id"
    t.string "card_brand"
    t.string "card_last4"
    t.string "card_exp_month"
    t.string "card_exp_year"
    t.string "promotion_code"
    t.boolean "account_locked", default: false
    t.string "country_code"
    t.string "authorization_scopes", default: [], array: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "area_description_fragments", "search_locations"
  add_foreign_key "area_descriptions", "search_locations"
  add_foreign_key "charges", "users"
  add_foreign_key "content_filter_results", "task_results"
  add_foreign_key "feedbacks", "legacy_task_runs", column: "task_run_id"
  add_foreign_key "full_listings", "users"
  add_foreign_key "inputs", "users"
  add_foreign_key "legacy_task_runs", "legacy_prompts"
  add_foreign_key "legacy_task_runs", "users"
  add_foreign_key "listing_fragments", "full_listings"
  add_foreign_key "prompts", "prompt_sets"
  add_foreign_key "recorded_completions", "task_results"
  add_foreign_key "recorded_completions", "task_runs"
  add_foreign_key "recorded_completions", "users"
  add_foreign_key "recorded_searches", "search_locations"
  add_foreign_key "recorded_searches", "users"
  add_foreign_key "subscriptions", "users"
  add_foreign_key "task_results", "prompts"
  add_foreign_key "task_results", "task_runs"
  add_foreign_key "task_runs", "prompt_sets"
  add_foreign_key "task_runs", "users"
  add_foreign_key "team_roles", "teams"
  add_foreign_key "team_roles", "users"
  add_foreign_key "text_results", "task_runs"
  add_foreign_key "translation_requests", "task_runs"
end
