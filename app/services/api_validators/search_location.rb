module ApiValidators
  class SearchLocation
    SEARCH_TEXT_LENGTH = 100
    RADIUS_VALUES = [2, 5, 25].freeze

    attr_reader :search_text, :search_radius, :errors

    def initialize(params)
      @params        = params
      @search_text   = params[:search_text]
      @search_radius = params[:search_radius]
      @errors        = []
    end

    def call
      validate_search_text
      validate_search_radius
      errors
    end

    def validate_search_text
      return unless search_text.blank? || search_text.chars.count > SEARCH_TEXT_LENGTH
      errors << { message: "search_text is required field and should be less than #{SEARCH_TEXT_LENGTH} characters" }
    end

    def validate_search_radius
      return if search_radius.is_a?(Integer) && RADIUS_VALUES.include?(search_radius)
      errors << { message: "search_radius must be provided as an integer. Acceptable values are #{RADIUS_VALUES.to_sentence}." }
    end
  end
end
