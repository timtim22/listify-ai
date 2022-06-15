module Taggable
  def generate_tags
    data = Taggers::Coordinate.for(request_type, attributes)
    update!(tags: data[:tags], input_text: data[:prompt])
  end
end
