class Charge < ApplicationRecord
  belongs_to :user

  scope :sorted, ->{ order(created_at: :desc) }
  default_scope ->{ sorted }

  def filename
    "receipt-#{created_at.strftime("%Y-%m-%d")}.pdf"
  end

  def receipt
    Receipts::Receipt.new(
      id: id,
      product: "your Listify subscription",
      company: {
        name: "Listify AI",
        address: "Address goes here",
        email: "hello@listify.ai"
      },
      line_items: line_items
    )
  end

  def line_items
    [
      ["Date", created_at.to_s],
      ["Account billed", "#{user.name} (#{user.email})"],
      ["Product", "Listify subscription"],
      ["Amount", ApplicationController.helpers.formatted_amount(amount)],
      ["Charged to", "#{card_brand} ending in #{card_last4}"]
    ]
  end
end
