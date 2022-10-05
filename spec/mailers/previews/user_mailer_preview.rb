class UserMailerPreview < ActionMailer::Preview
  def welcome
    UserMailer.welcome(User.first)
  end

  def trial_expiring_soon
    UserMailer.trial_expiring_soon(User.first)
  end

  def trial_expiring_today
    UserMailer.trial_expiring_today(User.first)
  end

  def subscription_activated
    UserMailer.subscription_activated(Subscription.first.user)
  end

  def subscription_cancelled
    UserMailer.subscription_cancelled(Subscription.first.user, Subscription.first)
  end

  def subscription_swapped
    UserMailer.subscription_swapped(Subscription.first.user)
  end

  def payment_received
    UserMailer.payment_received(User.first, Charge.first)
  end

  def payment_action_required
    payment_intent = Stripe::PaymentIntent.retrieve('pi_3KRDAKAAShUZq81I0LlS5tyO')

    UserMailer.payment_action_required(User.first, payment_intent, Subscription.first)
  end

  def team_invitation
    team_invitation = TeamInvitation.first
    team_name = team_invitation.team.name
    UserMailer.team_invitation(team_invitation.email, team_invitation.role, team_name)
  end
end
