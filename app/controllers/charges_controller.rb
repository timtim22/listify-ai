class ChargesController < ApplicationController
  before_action :authenticate_user!

  before_action :set_charge

  def show
    invoice = Subscriptions::Invoice.new(@charge)
    respond_to do |format|
      format.pdf {
        send_data(
          invoice.invoice.render,
          filename: invoice.filename,
          type: 'application/pdf',
          disposition: :inline
        )
      }
    end
  end

  private

  def set_charge
    @charge = current_user.charges.find(params[:id])
  end

end
