RSpec.describe ResponseFormatters::List do

  describe 'format' do
    it 'returns correctly formatted list' do
      input = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq input
    end

    it 'replaces number formatting i) with i.' do
      input = "1) villa in Lisbon\r\n\r\n2) Spacious \r\n\r\n3) Swimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'inserts missing space' do
      input = "1)villa in Lisbon\r\n\r\n2)Spacious \r\n\r\n3)Swimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'adds missing list numbers' do
      input = "villa in Lisbon\r\n\r\nSpacious \r\n\r\nSwimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'removes extra quotes' do
      input = "\"villa in Lisbon\"\r\n\r\n\"Spacious\" \r\n\r\nSwimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'handles new lines after numbers' do
      input = "1)\r\nvilla in Lisbon\r\n\r\n2)\r\nSpacious \r\n\r\n3)\r\nSwimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'strips incomplete last line' do
      input = "1)\r\nvilla in Lisbon\r\n\r\n2)\r\nSpacious \r\n\r\n3)\r\nSwimming pool. It has"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool."
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end

    it 'removes ad headline string' do
      input = "villa in Lisbon\r\n\r\nGoogle Ad headline: Spacious\" \r\n\r\nGoogle Ad headline: Swimming pool"
      output = "1. villa in Lisbon\r\n\r\n2. Spacious \r\n\r\n3. Swimming pool"
      result = ResponseFormatters::List.format(input)
      expect(result).to eq output
    end
  end
end
