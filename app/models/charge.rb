class Charge < ApplicationRecord
  belongs_to :user

  scope :sorted, ->{ order(created_at: :desc) }
  default_scope ->{ sorted }

  def retrieve_invoice_fields!
    invoice = Stripe::Charge.retrieve({
      id: stripe_id,
      expand: ['invoice']
    })['invoice']

    update!(
      invoice_number: invoice['number'],
      invoice_amount_excluding_tax: invoice['total_excluding_tax'],
      invoice_amount_tax: invoice['tax']
    )
  end

  def amount_excluding_tax
    retrieve_invoice_fields! if invoice_number.nil?
    invoice_amount_excluding_tax || amount
  end

  def send_payment_receipt!
    if user.charges.count > 1
      UserMailer.payment_received(user, self).deliver_later
    end
  end

  def refund(amount: nil) # refunds full amount by default
    Stripe::Refund.create(charge: stripe_id, amount: amount)
    update(amount_refunded: amount)
  end
end
