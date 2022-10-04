class Api::V1::Area::SearchesController < Api::V1::ApiController
  before_action :valid_params

  def create
    search_text = params[:search_text].downcase
    @search_location = SearchLocation.find_or_create_with(search_text)
    record_search_by_user

    if @search_location.latitude.nil?
      json_not_found("Sorry, our search provider couldn't identify that place. You could try a different search term, e.g, 'Waterloo, London' instead of 'Waterloo'.")
    else
      radius = params[:attraction_radius] * 1000
      @attractions = AreaSearch::AttractionFinder.new(
        @search_location,
        radius
      ).find!

      json_success(@attractions)
    end
  end

  private

  def valid_params
    if params[:search_text].nil? || params[:attraction_radius].nil?
      json_bad_request('search_text and attraction_radius are required fields')
    elsif !params[:attraction_radius].integer?
      json_bad_request('attraction_radius kilometer should be a number i.e 1, 5, 10')
    end
  end

  def record_search_by_user
    @search_location.recorded_searches.create!(user: current_user)
    recorded_search_volume = RecordedSearch.where('created_at > ?', Date.today.beginning_of_day).count
    raise 'Unexpected search volume recorded!' if recorded_search_volume > 200

    return unless recorded_search_volume == 150

    AdminMailer.unexpected_search_volume.deliver_later
  end
end
