
const snippets = {
  property_type:['apartment', 'B&B', 'cabin', 'cottage', 'condo', 'farmhouse', 'flat', 'house', 'loft', 'penthouse', 'studio apartment', 'villa'],
  ideal_for: ['couples', 'small families', 'families with children', 'families', 'friends', 'large groups', 'business travelers', 'solo travelers', 'romantic weekends', 'remote workers', 'sightseeing'],
  location: ['Amsterdam', 'Barcelona', 'Berlin', 'Dubai', 'Edinburgh', 'Florida', 'Lisbon', 'London', 'Malaga', 'New York', 'Paris', 'Sydney'],
  key_features: ['balcony', 'barbecue', 'cozy', 'garden', 'hot tub', 'luxury', 'modern', 'near bars and restaurants', 'near beach', 'near shops', 'sea views', 'spacious', 'swimming pool', 'pet friendly', 'wifi'],
}

export const snippetsForField = (field) => {
  return snippets[field] || [];
};
