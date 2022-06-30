module Subscriptions
  class Invoice
    attr_reader :charge, :user, :customer

    def initialize(charge)
      @charge   = charge
      @user     = charge.user
      @customer = Subscriptions::Customer.fetch(user)
      fetch_invoice_details
    end

    def fetch_invoice_details
      if charge.invoice_number.nil?
        charge.retrieve_invoice_fields!
        charge.reload
      end
    end

    def filename
      "listify-invoice-#{display_date(charge.created_at)}.pdf"
    end

    def invoice
      Receipts::Invoice.new(
        details: [
          ['Invoice Number', charge.invoice_number],
          vat_field,
          ['Date due', display_date(charge.created_at)],
          ['Date paid', display_date(charge.created_at)],
          ['Charged to', "#{charge.card_brand} ending in #{charge.card_last4}"]
        ].compact,
        recipient: [
          'Bill to:',
          customer.name,
          customer.line1,
          customer.line2,
          customer.city,
          customer.state,
          customer.country,
          customer.postal_code,
          user.email
        ].compact,
        company: {
          name: company_name,
          address: '28 Rennie Court, 11 Upper Ground, London SE1 9LP',
          email: 'hello@listify.ai'
        },
        line_items: line_items
      )
    end

    private

    def line_items
      items = [
        ['<b>Item</b>', '<b>Unit Cost</b>', '<b>Quantity</b>', '<b>Amount</b>'],
        ['Listify AI subscription', display_amount(charge.invoice_amount_excluding_tax), 1, display_amount(charge.invoice_amount_excluding_tax)],
        tax_line_item,
        [nil, nil, '<b>Total</b>', display_amount(charge.amount)]
      ].compact

      if charge.amount_refunded?
        items << [nil, nil, 'Amount Refunded', display_amount(charge.amount_refunded)]
      end
      items
    end

    def tax_line_item
      return unless charge.invoice_amount_tax

      [nil, nil, 'Tax', display_amount(charge.invoice_amount_tax)]
    end

    def display_date(datetime)
      datetime.strftime('%Y-%m-%d')
    end

    def display_amount(amount_to_display)
      ApplicationController.helpers.formatted_amount(amount_to_display)
    end

    def company_name
      if charge.created_at > Date.new(2022, 06, 30).beginning_of_day
        'People & Robots Ltd (formerly Venture Rocket Ltd)'
      else
        'Venture Rocket Ltd'
      end
    end

    def vat_field
      return unless charge.invoice_amount_tax

      ['UK VAT Number', '404 9631 03']
    end
  end
end
