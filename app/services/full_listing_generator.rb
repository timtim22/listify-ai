class FullListingGenerator
  HEAD_REQUEST_TYPE = 'headline_fragment'.freeze
  ROOM_REQUEST_TYPE = 'room_description'.freeze
  ROOM_SECOND_REQUEST_TYPE = 'full_listing_room_step_2'.freeze

  attr_reader :user, :full_listing, :attrs
  attr_accessor :task_ids_in_output

  def initialize(attrs, user)
    @user = user
    @full_listing = FullListing.new(user: user)
    @attrs = attrs
    @task_ids_in_output = []
  end

  def create!
    full_listing.save!
    generate_summary
    generate_bedrooms
    generate_other_rooms
    set_output_task_ids
    full_listing
  end

  private

  def generate_summary
    fragment = new_fragment(attrs[:headline_text], HEAD_REQUEST_TYPE)
    save = Input.create_with(fragment, user)
    task_run = TaskRunner.new.run_for!(save.input_object, user, nil)
    task_ids_in_output << task_run.id
  end

  def generate_bedrooms
    bedrooms = format_bedrooms(attrs[:bedrooms])
    generate_fragments_for(bedrooms)
  end

  def generate_other_rooms
    other_rooms = format_other_rooms(attrs[:rooms])
    generate_fragments_for(other_rooms)
  end

  def set_output_task_ids
    full_listing.update(task_run_ids: task_ids_in_output)
  end

  def generate_fragments_for(rooms)
    inputs = join_inputs_if_short(rooms)
    inputs.each do |input_text|
      generate_fragment(input_text)
    end
  end

  def generate_fragment(input_text)
    if !input_text.blank?
      fragment = new_fragment(input_text, ROOM_REQUEST_TYPE)
      save = Input.create_with(fragment, user)
      task_run = TaskRunners::TwoStep.new.run_for!(
        save.input_object,
        user,
        ROOM_SECOND_REQUEST_TYPE,
        nil
      )
      task_ids_in_output << task_run.id
    end
  end

  def new_fragment(input_text, request_type)
    ListingFragment.new({
      full_listing: full_listing,
      input_text: input_text,
      request_type: request_type
    })
  end

  def join_inputs_if_short(rooms)
    inputs = []
    in_slices_of(2, rooms).map do |slice|
      if under_250_chars_combined?(slice)
        inputs << slice.join("\n")
      else
        slice.each { |individual_room| inputs << individual_room }
      end
    end
    inputs
  end

  def in_slices_of(number, array)
    array.each_slice(number).to_a
  end

  def under_250_chars_combined?(slice)
    slice.join("\n").length < 250
  end

  def format_bedrooms(unformatted)
    formatted = []
    unformatted.each_with_index do |content, i|
      formatted << "Bedroom #{i + 1}: #{content}" if content.present?
    end
    formatted
  end

  def format_other_rooms(unformatted)
    formatted = []
    unformatted.each_with_index do |room, i|
      if room[:name].present?
        formatted << "#{room[:name]}: #{room[:description]}"
      end
    end
    formatted
  end
end
