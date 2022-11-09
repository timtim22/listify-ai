class RegisterStep < ApplicationRecord
  belongs_to :procedure

  delegated_type :step, types: ["Step::Prompt"]

  acts_as_list scope: :procedure
  accepts_nested_attributes_for :step, update_only: true, reject_if: :all_blank, allow_destroy: true

  validates_associated :step
end
