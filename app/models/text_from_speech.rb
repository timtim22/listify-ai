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

  def run_for(blob)
    audio      = { content: audio_as_wav(blob) }
    config     = { language_code: "en-GB" }
    response   = speech_client.recognize(config: config, audio: audio)

    if response.results.empty?
      ""
    else
      response.results.first.alternatives.first.transcript
    end
  end

  def audio_as_wav(blob)
    File.open('tmp/recorded.wav', 'wb') { |f| f.write blob.read }
    File.binread 'tmp/recorded.wav'
  end

  def fetch_credentials
    Rails.application.credentials.dig(:google, :speech_credentials)
  end
end
