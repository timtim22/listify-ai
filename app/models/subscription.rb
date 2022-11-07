class Subscription < ApplicationRecord
  belongs_to :user

  scope :with_created_states, -> { where.not(status: %w[incomplete incomplete_expired]) }
  scope :cancelled, -> { with_created_states.where.not(ends_at: nil) }
  scope :active, -> { with_created_states.where(ends_at: nil) }

  def plan
    Plan.find_by(stripe_id: stripe_plan)
  end

  def active?
    ["trialing", "active"].include?(status) && (ends_at.nil? || on_grace_period? || on_trial?)
  end

  def on_grace_period?
    cancelled? && Time.zone.now < ends_at
  end

  def on_trial?
    trial_ends_at? && Time.zone.now < trial_ends_at
  end

  def cancelled?
    ends_at?
  end

  def lapsed?
    cancelled? && !on_grace_period?
  end

  def incomplete?
    %w[incomplete incomplete_expired].include?(status)
  end

  def has_incomplete_payment?
    ["past_due", "incomplete"].include?(status)
  end

  def cancel
    sub = Stripe::Subscription.update(stripe_id, { cancel_at_period_end: true })
    update(status: "cancelled", ends_at: Time.at(sub.cancel_at))
    send_cancellation_email
  end

  def cancel_now!
    sub = Stripe::Subscription.delete(stripe_id)
    update(status: "cancelled", ends_at: Time.at(sub.ended_at))
  end

  def resume
    if Time.current < ends_at
      Stripe::Subscription.update(stripe_id, cancel_at_period_end: false)
      update(status: "active", ends_at: nil)
    else
      raise StandardError, "You cannot resume a subscription that has already been cancelled."
    end
  end

  def swap(plan)
    stripe_sub = stripe_subscription

    args = {
      cancel_at_period_end: false,
      items: [
        {
          id: stripe_sub.items.data[0].id,
          plan: plan
        }
      ]
    }

    Stripe::Subscription.update(stripe_id, args)
    update(stripe_plan: plan, ends_at: nil)
    send_swap_plan_email
  end

  def recently_activated?
    active? && created_at > Time.zone.now - 2.days
  end

  def stripe_subscription
    Stripe::Subscription.retrieve(stripe_id)
  end

  def subscribed_successfully_steps
    send_confirmation_email
    Subscriptions::TeamSetup.call(self, user)
  end

  def send_confirmation_email
    UserMailer.subscription_activated(user).deliver_later
  end

  def send_cancellation_email
    UserMailer.subscription_cancelled(user, self).deliver_later
  end

  def send_swap_plan_email
    UserMailer.subscription_swapped(user).deliver_later
  end
end
