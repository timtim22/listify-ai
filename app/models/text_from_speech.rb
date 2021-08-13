class TextFromSpeech
  attr_reader :speech_client

  def initialize
    @speech_client = initialize_client
  end

  def initialize_client
    Google::Cloud::Speech.speech do |config|
      credentials = fetch_credentials
      credentials[:private_key].gsub!("\\n", "\n")
      config.credentials = credentials
    end
  end

  def from(blob)
    audio      = { content: File.binread(blob.tempfile) }
    config     = { language_code: "en-GB" }
    response   = speech_client.recognize(config: config, audio: audio)

    if response.results.empty?
      ""
    else
      response.results.first.alternatives.first.transcript
    end
  end

  def fetch_credentials
    Rails.application.credentials.dig(:google, :speech_credentials)
  end
end
