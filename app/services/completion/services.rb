module Completion
  module Services
    GPT        = 'Gpt'.freeze
    AI21       = 'Ai21'.freeze
    COHERE     = 'Cohere'.freeze
    MOCK       = 'Mock'.freeze
    ALL        = [GPT, AI21, COHERE, MOCK].freeze
    PRODUCTION = [GPT, AI21, COHERE].freeze
  end
end
