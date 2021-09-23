module Inputable
  extend ActiveSupport::Concern

  included do
    has_one :input, as: :inputable, touch: true
    accepts_nested_attributes_for :input
  end

  delegate :user, :to => :input
end

