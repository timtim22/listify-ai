json.prompt_sets(@prompt_sets) do |prompt_set|
  json.id prompt_set.id
  json.title prompt_set.title
  json.request_type prompt_set.request_type
  json.prompts(prompt_set.prompts) do |prompt|
    json.id prompt.id
    json.title prompt.title
    json.content prompt.content
    json.stop prompt.stop
    json.max_tokens prompt.max_tokens
    json.top_p prompt.top_p
    json.presence_penalty prompt.presence_penalty
    json.frequency_penalty prompt.frequency_penalty
    json.engine prompt.engine
    json.gpt_model_id prompt.gpt_model_id
    json.number_of_results prompt.number_of_results
    json.position prompt.position
    json.labels prompt.labels
  end
end
