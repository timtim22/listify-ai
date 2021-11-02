class AreaDescription
  include ActiveModel::Model

  attr_accessor :selected_ids, :search_results

  def generate
    #sentences = []
    #selected_attractions.each do |k, v|
      #v.each { |a| sentences << sentence_for(a) }
    #end
    #puts sentences.join("")
    #sentences.join("")
    AreaDescriptionGenerator.new(selected_attractions).run!

  end

  def sentence_for(attraction)
    if attraction.distance.present?
      "It is #{attraction.distance[:duration]} minutes walk (#{attraction.distance[:distance]}km) from #{attraction.name}. "
    else
      "It is near #{attraction.name}. "
    end
  end

  def selected_attractions
    selected = {}
    search_results.each do |key, results|
      selected[key.to_sym] = []
      results.each do |result|
        if selected_ids.include?(result["place_id"])
          selected[key.to_sym] << Attraction.from_hash(result)
        end
      end
    end
    selected
  end
end
