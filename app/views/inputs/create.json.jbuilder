json.success @response[:success]
json.response_text @response[:response_text].strip
json.original_text @response[:original_text]
json.original_length @response[:original_text].length
