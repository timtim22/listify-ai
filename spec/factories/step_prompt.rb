FactoryBot.define do
  factory 'Step::Prompt' do
    title {"Example listing description prompt"}
    content {"Write an Airbnb listing for a property with the following features: {input}"}
    stop {"stop test"}
    temperature {0.5}
    top_p {1.0}
    frequency_penalty {0.1}
    presence_penalty {0.0}
    engine {"text-davinci-002"}
    number_of_results {1}
    service {"Gpt"}
  end
end
