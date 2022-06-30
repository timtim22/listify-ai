class AddInvoiceFieldsToCharge < ActiveRecord::Migration[6.1]
  def change
    add_column :charges, :invoice_amount_excluding_tax, :integer
    add_column :charges, :invoice_amount_tax, :integer
    add_column :charges, :invoice_number, :string
  end
end
