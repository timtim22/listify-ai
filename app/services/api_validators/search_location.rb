module ApiValidators
  class SearchLocation
    SEARCH_TEXT_LENGTH = 100
    RADIUS_VALUES = [2, 5, 25].freeze

    attr_reader :current_user, :search_text, :search_radius, :errors

    def initialize(params, current_user)
      @current_user  = current_user
      @search_text   = params[:search_text]
      @search_radius = params[:search_radius]
      @errors        = []
    end

    def call
      validate_search_text
      validate_search_radius
      validate_spins_remaining
      errors
    end

    def validate_search_text
      return unless search_text.blank? || search_text.chars.count > SEARCH_TEXT_LENGTH
      errors << { message: "search_text is required field and should be less than #{SEARCH_TEXT_LENGTH} characters" }
    end

    def validate_search_radius
      return if RADIUS_VALUES.include?(search_radius.to_i)
      errors << { message: "search_radius must be provided as an integer. Acceptable values are #{RADIUS_VALUES.to_sentence}." }
    end

    def validate_spins_remaining
      return unless current_user.runs_remaining_today <= 0
      errors << { message: 'No Spins remaining on your account. Please upgrade or contact us for assistance.' }
    end
  end
end
