class EnabledModule < ApplicationRecord
  belongs_to :user
  belongs_to :listify_module

  def name
    listify_module.name
  end
end
