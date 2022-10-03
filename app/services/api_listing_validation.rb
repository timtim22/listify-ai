class ApiListingValidation
  TEXT_CHARS_COUNT      = 70
  FEATURES_ARRAY_COUNT  = 360
  MAX_NUMBER_OF_BEDROOM = 100

  def initialize(params, current_user, output_language)
    @params               = params
    @current_user         = current_user
    @supported_languages  = %w[EN DA DE ES FR IT NL EN]
    @output_language      = output_language
    @listing_field        = @params['listing_field']
    @property_type        = @params['text']['property_type']
    @ideal_for            = @params['text']['ideal_for']
    @location             = @params['text']['location']
    @number_of_bedrooms   = @params['text']['number_of_bedrooms']
    @features             = @params['text']['features']
  end

  def call
    error_message = []
    error_message << { message: 'Required fields are as follows: property_type, ideal_for, location, number_of_bedrooms, features' } if missing_params
    error_message << { message: "Language not supported. Only following output languages are supported: #{@supported_languages}" } unless supported_language_check
    error_message << { message: "property_type characters count should be less than #{TEXT_CHARS_COUNT}" } if property_type_character_count_check
    error_message << { message: "ideal_for characters count should be less than #{TEXT_CHARS_COUNT}" } if ideal_for_character_count_check
    error_message << { message: "location characters count should be less than #{TEXT_CHARS_COUNT}" } if location_character_count_check
    error_message << { message: "number_of_bedrooms should be between 0 and #{MAX_NUMBER_OF_BEDROOM}" } unless number_of_bedrooms_count_check
    error_message << { message: "features_count characters count should be less than #{FEATURES_ARRAY_COUNT}" } if features_count_check
    error_message << { message: 'No Spin remaning.' } if spin_check

    error_message
  end

  def missing_params
    @property_type.nil? || @ideal_for.nil? || @location.nil? || @number_of_bedrooms.nil? || @features.nil?
  end

  def supported_language_check
    @supported_languages.include? @output_language
  end

  def property_type_character_count_check
    @property_type.chars.count > TEXT_CHARS_COUNT if @property_type
  end

  def ideal_for_character_count_check
    @ideal_for.chars.count > TEXT_CHARS_COUNT if @ideal_for
  end

  def location_character_count_check
    @location.chars.count > TEXT_CHARS_COUNT if @location
  end

  def number_of_bedrooms_count_check
    @number_of_bedrooms.to_i >= 0 && @number_of_bedrooms.to_i <= MAX_NUMBER_OF_BEDROOM if @number_of_bedrooms
  end

  def features_count_check
    @features.join.chars.count > FEATURES_ARRAY_COUNT if @features
  end

  def spin_check
    @current_user.runs_remaining_today <= 0
  end
end
