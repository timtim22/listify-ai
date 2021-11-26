class FullListing < ApplicationRecord
  has_many :listing_fragments, dependent: :destroy
  has_many :translations, as: :translatable, dependent: :destroy
  belongs_to :user

  scope :today, -> { where(created_at: [DateTime.current.beginning_of_day..DateTime.current]) }

  def self.from(attrs, user)
    #this should be a service
    full_listing = FullListing.create!(user: user)
    fragment_request_type = 'room_fragment'
    #fragment_request_type = attrs[:high_flair] ? 'room_fragment_higher_flair' : 'room_fragment'
    bedrooms = format_bedrooms(attrs[:bedrooms])
    other_rooms = format_other_rooms(attrs[:rooms])
    generate_headline_fragment(full_listing, attrs[:headline_text], user)
    generate_fragment_set(full_listing, bedrooms, user, fragment_request_type)
    generate_fragment_set(full_listing, other_rooms, user, fragment_request_type)
    #should there be a relationship between a full listing and a task run?
    full_listing
  end

  def self.generate_headline_fragment(full_listing, input, user)
    save = Input.create_with(ListingFragment.new({ full_listing: full_listing, input_text: input, request_type: 'headline_fragment' }), user)
    TaskRunner.new.run_for!(save.input_object, user, nil)
  end

  def self.generate_fragment_set(full_listing, rooms, user, fragment_request_type)
    fragments = []
    sliced = rooms.each_slice(2).to_a
    sliced.map do |slice|
      joined = slice.join("\n")
      if joined.length < 250
        fragments << joined
      else
        slice.each { |room| fragments << room }
      end
    end
    fragments.each do |fragment|
      generate_listing_fragment(full_listing, fragment, user, fragment_request_type)
    end
  end

  def self.generate_listing_fragment(full_listing, input, user, fragment_request_type)
    if !input.blank?
      save = Input.create_with(ListingFragment.new({ full_listing: full_listing, input_text: input, request_type: fragment_request_type }), user)
      TaskRunner.new.run_for!(save.input_object, user, nil)
    end
  end

  def self.format_bedrooms(unformatted)
    formatted = []
    unformatted.each_with_index do |content, i|
      formatted << "Bedroom #{i + 1}: #{content}" if content.present?
    end
    formatted
  end

  def self.format_other_rooms(unformatted)
    formatted = []
    unformatted.each_with_index do |room, i|
      if room[:name].present?
        formatted << "#{room[:name]}: #{room[:description]}"
      end
    end
    formatted
  end

  def result_text
    if requests_completed?
      results = listing_fragments.map(&:result)
      if no_request_errors?(results)
        good_result_text(results)
      else
        error_result_text(results)
      end
    else
      ""
    end
  end

  def good_result_text(results)
    results.map(&:result_text).map(&:strip).join("\n\n")
  end

  def error_result_text(results)
    "There was an error with this request. Please try again, or let us know if this keeps happening."
  end

  def no_request_errors?(results)
    results.all?(&:success)
  end

  def check_complete
    if listing_fragments.any? && listing_fragments.all?(&:requests_completed?)
      self.update!(requests_completed: true)
    end
  end
end
