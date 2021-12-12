class Subscription < ApplicationRecord
  belongs_to :user

  def active?
    ["trialing", "active"].include?(status) && (ends_at.nil? || on_grace_period? || on_trial?)
  end

  def on_grace_period
    cancelled? && Time.zone.now < ends_at
  end

  def on_trial?
    trial_ends_at? && Time.zone.now < trial_ends_at
  end

  def cancelled?
    ends_at?
  end

  def has_incomplete_payment?
    ["past_due", "incomplete"].include?(status)
  end
end
