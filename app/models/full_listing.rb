class FullListing < ApplicationRecord
  has_many :listing_fragments, dependent: :destroy

  def self.from(attrs, user)
    #this should be a service
    full_listing = FullListing.create!
    bedrooms = format_bedrooms(attrs[:bedrooms])
    other_rooms = format_other_rooms(attrs[:rooms])
    generate_listing_fragment(full_listing, bedrooms, user)
    #generate_listing_fragment(full_listing, bedrooms, user)
    generate_listing_fragment(full_listing, other_rooms, user)
    # smaller input text blocks could be combined into a single fragment if they fit the same prompt
    #should there be a relationship between a full listing and a task run?
    full_listing
  end

  def self.generate_listing_fragment(full_listing, input, user)
    if !input.blank?
      save = Input.create_with(ListingFragment.new({ full_listing: full_listing, input_text: input, request_type: 'room_fragment' }), user)
      TaskRunner.new.run_for!(save.input_object, user, nil)
    end
  end

  def self.format_bedrooms(unformatted)
    formatted = []
    unformatted.each_with_index do |content, i|
      formatted << "Bedroom #{i + 1}: #{content}" if content.present?
    end
    formatted.join("\n")
  end

  def self.format_other_rooms(unformatted)
    formatted = []
    unformatted.each_with_index do |room, i|
      if room[:name].present?
        formatted << "#{room[:name]}: #{room[:description]}"
      end
    end
    formatted.join("\n")
  end

  def text
    requests_completed ? listing_fragments.map(&:result_text).join("") : ""
  end

  def check_complete
    if listing_fragments.any? && listing_fragments.all?(&:requests_completed?)
      self.update!(requests_completed: true)
    end
  end
end
