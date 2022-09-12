raise "Running in production!" if Rails.env.production?

description_prompt_set = PromptSet.create!(
  title: 'Listing Description',
  request_type: 'listing_description'
)

description_prompt_set.prompts.create!(
  title: 'Example listing description prompt',
  content: "Write an Airbnb listing for a property with the following features: {input}",
  stop: "",
  temperature: 0.5,
  max_tokens: 250,
  top_p: 1.0,
  frequency_penalty: 0.1,
  presence_penalty: 0.0,
  service: 'Gpt',
  engine: 'text-davinci-002'
)

title_prompt_set = PromptSet.create!(
  title: 'Listing Title',
  request_type: 'listing_title'
)

title_prompt_set.prompts.create!(
  title: 'Example listing title prompt',
  content: "Write an Airbnb listing title for a property with the following features: {input} Title:",
  stop: "",
  temperature: 0.5,
  max_tokens: 50,
  top_p: 1.0,
  frequency_penalty: 0.1,
  presence_penalty: 0.0,
  service: 'Gpt',
  engine: 'text-davinci-002'
)


area_prompt_set = PromptSet.create!(
  title: 'Area description',
  request_type: 'area_description'
)

area_prompt_set.prompts.create!(
  title: 'Example area description prompt',
  content: "Write a promotional neighbourhood description for {area} based on the following: {input}",
  stop: "",
  temperature: 0.5,
  max_tokens: 250,
  top_p: 1.0,
  frequency_penalty: 0.1,
  presence_penalty: 0.0,
  service: 'Gpt',
  engine: 'text-davinci-002'
)

Plan.create(name: "starter", stripe_id: "price_1K5FN2AAShUZq81IpSbu8SjG", amount: 39_00, interval: "month")
Plan.create(name: "standard", stripe_id: "price_1KHBKPAAShUZq81Iro6BtLy6", amount: 139_00, interval: "month")
Plan.create(name: "premium", stripe_id: "price_1KHBLQAAShUZq81IYtQMtvFw", amount: 399_00, interval: "month")
