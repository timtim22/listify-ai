RSpec.describe InputTextService do

  describe 'Fixes Input Service' do
    it 'Remove the bedroom for studio' do
      input_text = "- 1 bedroom studio in london\n- ideal for couple\n- egg."
      service = InputTextService.new(input_text).call
      expect(service).to eq "- studio in london\n- ideal for couple\n- egg."
    end

    it 'Remove the extra new line from the input_text' do
      input_text = "- 1 bedroom house in london\n- ideal for couple\n- egg\n- ."
      service = InputTextService.new(input_text).call
      expect(service).to eq "- 1 bedroom house in london\n- ideal for couple\n- egg."
    end
  end
end
