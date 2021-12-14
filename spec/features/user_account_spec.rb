describe "account features", type: :feature do
  before(:each) do
    @user = create(:user)
  end

  xit "account log in", js: true do
    visit '/users/sign_in'

    fill_in 'Email', with: @user.email
    fill_in 'Password', with: 'password'

    click_button 'Log in'
    expect(page).to have_content 'Welcome!'
  end
end
