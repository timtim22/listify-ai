class Charge < ApplicationRecord
  belongs_to :user

  scope :sorted, ->{ order(created_at: :desc) }
  default_scope ->{ sorted }

  def send_payment_receipt!
    if user.charges.count > 1
      UserMailer.payment_received(user, self).deliver_later
    end
  end

  def filename
    "receipt-#{created_at.strftime('%Y-%m-%d')}.pdf"
  end

  def receipt
    Receipts::Receipt.new(
      details: [['Charge Id', id]],
      recipient: user.email,
      company: {
        name: 'People & Robots Ltd',
        address: '28 Rennie Court, 11 Upper Ground, London SE1 9LP',
        email: 'hello@listify.ai'
      },
      line_items: line_items
    )
  end

  def line_items
    items = [
      ['Date', created_at.to_s],
      ['Account billed', "#{user.name} (#{user.email})"],
      ['Product', 'Listify AI subscription (plus VAT, if applicable)'],
      ['Amount', ApplicationController.helpers.formatted_amount(amount)],
      ['Charged to', "#{card_brand} ending in #{card_last4}"]
    ]

    if amount_refunded?
      items << ['Amount Refunded', ApplicationController.helpers.formatted_amount(amount_refunded)]
    end
    items
  end

  def refund(amount: nil)
    Stripe::Refund.create(charge: stripe_id, amount: amount)
    update(amount_refunded: amount)
  end
end
