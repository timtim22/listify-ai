module ContentFilters
  class Custom

    def self.run_for!(task_result)
      if fails_test?(task_result.result_text)
        task_result.update(failed_custom_filter: true)
      end
    end

    def self.fails_test?(result_text)
      ['http', 'www.'].any? do |flag|
        result_text.include? flag
      end
    end
  end
end
