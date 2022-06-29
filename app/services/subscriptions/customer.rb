module Subscriptions
  class Customer
    attr_accessor :name, :line1, :line2, :city, :state, :country, :postal_code

    def initialize(**params)
      @name        = params[:name]
      @line1       = params[:line1]
      @line2       = params[:line2]
      @city        = params[:city]
      @state       = params[:state]
      @country     = params[:country]
      @postal_code = params[:postal_code]
    end

    def self.update(user, customer_params)
      formatted_params = format_params(customer_params)
      Stripe::Customer.update(user.stripe_id, formatted_params)
    end

    def self.editable_stripe_customer(user)
      return unless user.stripe_id

      customer = user.stripe_customer
      Subscriptions::Customer.new(
        name: customer['name'],
        line1: customer['address'] && customer['address']['line1'],
        line2: customer['address'] && customer['address']['line2'],
        city: customer['address'] && customer['address']['city'],
        state: customer['address'] && customer['address']['state'],
        country: customer['address'] && customer['address']['country'],
        postal_code: customer['address'] && customer['address']['postal_code'],
      )

      Subscriptions::Customer.new(
        name: 'test2',
        line1: 'line_1',
        line2: 'line_2',
        city: 'line_1',
        state: 'line_1',
        country: 'line_1',
        postal_code: 'line_1'
      )
    end

    private

    def self.format_params(customer_params)
      {
        name: customer_params[:name],
        address: customer_params.except(:name).to_h
      }
    end
  end
end
