module Subscriptions
  class TeamSetup
    def self.call(subscription, user)
      return if user.team.present?

      default_company_name = user.stripe_customer.name

      return if Team.find_by(name: default_company_name).present?

      team = Team.create_with_plan!(default_company_name, subscription.plan)
      team.add_admin(user)
    end
  end
end
