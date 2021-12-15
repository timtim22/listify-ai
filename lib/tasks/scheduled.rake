
desc "Send gpt request to keep models warm"
task :send_gpt_request => [:environment] do |t, args|
	GptRefreshWorker.perform_async
end


