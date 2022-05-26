module Taggers
  class OyoOne

    PROP_TYPES = [
      'apartment',
      'bungalow',
      'cabin',
      'chalet',
      'cottage',
      'farmhouse',
      'flat',
      'holiday home',
      'house',
      'mansion',
      'studio',
      "shepherd's hut",
      'villa'
    ].freeze

    def prompt_for(obj)
      strings = [
        "#{obj.property_type}#{obj.location && " in #{obj.location}"}",
        obj.location_detail,
        "ideal for #{obj.target_user}",
        obj.usp_one,
        obj.usp_two,
        obj.usp_three
      ].compact_blank

      "- #{strings.join("\n- ")}"
    end

    def tags_for(obj)
      tags = []
      tags << property_tag(obj.property_type)
      tags << location_detail_tags(obj.location_detail)
      tags << target_user_tags(obj.target_user)
      tags << usp_tags(obj.usp_one)
      tags << usp_tags(obj.usp_two)
      tags << usp_tags(obj.usp_three)
      tags.flatten!.compact!
      tags
    end

    private

    def property_tag(property_type)
      pt = PROP_TYPES.find { |pt| pt == property_type.downcase }
      "pt_#{property_type}" if pt
    end

    def location_detail_tags(location_detail)
      return if location_detail.blank?

      str = location_detail.downcase.strip
      tags = []

      if str.scan(/[\w-]+/).size == 1
        tags << location_detail
      else
        tags << 'ld_beach' if includes(str, 'beach', 'the sea')
        tags << 'ld_countryside' if includes(str, 'rural', 'countryside', 'meadow', 'nature', 'hill')
        tags << 'ld_forest' if includes(str, 'woods', 'forest')
        tags << 'ld_river' if includes(str, 'river')
        tags << 'ld_mountains' if includes(str, 'mountain')
        tags << 'ld_hiking' if includes(str, 'hiking')
        tags << 'ld_skiing' if includes(str, 'skiing', ' ski ')
      end
      tags
    end

    def target_user_tags(target_user)
      str = target_user.downcase.strip.delete_prefix('a ')
      tags = []
      tags << 'tu_couple' if includes(str, 'couple', 'two people')
      tags << 'tu_children' if includes(str, 'child', 'kid')
      tags << 'tu_family' if includes(str, 'famil')
      tags << 'tu_friends' if includes(str, 'friends')
      tags << 'tu_small_groups' if includes(str, 'small')
      tags << 'tu_large_groups' if includes(str, 'large')
      tags
    end

    def usp_tags(usp)
      return if usp.blank?

      str = usp.downcase.strip
      [amenity_tags(str), ambience_tags(str), other_tags(str)].flatten.compact
    end

    def amenity_tags(usp)
      tags = []
      tags << 'am_shared_pool' if includes(usp, 'shared pool', 'shared swimming pool')
      tags << 'am_private_pool' if includes(usp, 'private pool', 'private swimming pool')
      tags << 'am_pool' if includes(usp, 'pool')
      tags << 'am_hot_tub' if includes(usp, 'hot tub', 'sauna', 'jacuzzi')
      tags << 'am_sun_bed' if includes(usp, 'sun bed', 'sun lounger')
      tags << 'am_bbq' if includes(usp, 'bbq', 'barbecue')
      tags << 'am_garden' if includes(usp, 'garden')
      tags << 'am_balcony' if includes(usp, 'balcony', 'veranda')
      tags << 'am_terrace' if includes(usp, 'terrace')
      tags << 'am_courtyard' if includes(usp, 'courtyard')
      tags << 'am_fireplace' if includes(usp, 'fireplace')
      tags << 'am_air_con' if includes(usp, 'air con')
      tags << 'am_heating' if includes(usp, 'heating')
      tags << 'am_washing_machine' if includes(usp, 'washing machine')
      tags << 'am_wifi' if includes(usp, 'wifi', 'wi-fi')
      tags << 'am_parking' if includes(usp, 'parking')
      tags
    end

    def ambience_tags(usp)
      tags = []
      tags << 'mb_cosy' if includes(usp, 'cosy')
      tags << 'mb_spacious' if includes(usp, 'spacious')
      tags << 'mb_luxury' if includes(usp, 'luxur', 'lavish')
      tags << 'mb_elegant' if includes(usp, 'elegant')
      tags << 'mb_romantic' if includes(usp, 'romantic')
      tags << 'mb_charming' if includes(usp, 'charming')
      tags << 'mb_tasteful' if includes(usp, 'tasteful')
      tags << 'mb_peaceful' if includes(usp, 'peace', 'quiet', 'serene', 'relax')
      #tags << 'mb_city' if includes(usp, 'city')
      #tags << 'mb_countryside' if includes(usp, 'countryside', 'rural')
      #tags << 'mb_beach' if includes(usp, 'beach')
      tags
    end

    def other_tags(usp)
      tags = []
      tags << 'om_kitchen' if includes(usp, 'kitchen')
      tags << 'om_interiors' if includes(usp, 'interiors')
      tags << 'om_ground_floor' if includes(usp, 'ground floor')
      tags << 'om_pet_friendly' if includes(usp, 'pet friendly', 'pet-friendly')
      tags << 'om_views' if includes(usp, 'views')
      tags
    end

    def includes(string, *search_terms)
      search_terms.any? { |term| string.include? term }
    end
  end
end
