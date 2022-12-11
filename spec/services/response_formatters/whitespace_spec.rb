RSpec.describe ResponseFormatters::Whitespace do
  describe 'format' do
    it 'removes whitespace' do
      input = ' Escapade romantique à Malaga '
      result = ResponseFormatters::Whitespace.format(input)
      expect(result).to eq 'Escapade romantique à Malaga'
    end

    it 'removes newlines' do
      input = "\n\n Escapade romantique à Malaga\n "
      result = ResponseFormatters::Whitespace.format(input)
      expect(result).to eq 'Escapade romantique à Malaga'
    end

    it 'removes wrapping quotes' do
      input = ' "Escapade romantique à Malaga" '
      result = ResponseFormatters::Whitespace.format(input)
      expect(result).to eq 'Escapade romantique à Malaga'
    end

    it 'returns original text' do
      input = 'Escapade romantique à Malaga'
      result = ResponseFormatters::Whitespace.format(input)
      expect(result).to eq 'Escapade romantique à Malaga'
    end
  end
end
