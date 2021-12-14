require_relative '../helpers/stripe_helper'

describe "subscription features", type: :feature do
  before(:each) do
    @user = create(:user)
    login_as(@user)
  end

  after(:each) do
    if @user.subscribed?
      @user.subscription.cancel_now!
    end
  end

  xit "creates a subscription", js: true do
    plan_id = Plan.find_by(name: "Test") # must be seeded in db and match on stripe

    visit new_subscription_path(plan_id: plan_id)
    fill_stripe_elements
    fill_in "name_on_card", with: @user.name
    click_button 'Subscribe'

    expect(page).to have_content "Thanks for subscribing"
  end
end
