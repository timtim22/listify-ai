class Taggers::Rule < ApplicationRecord
  scope :keywords_include, ->(str) { where("array_to_string(keywords,',') ILIKE ?", "%#{str}%") }

  def self.ransackable_scopes(_auth_object = nil)
    [:keywords_include]
  end
end
