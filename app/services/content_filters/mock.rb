module ContentFilters
  class Mock
    def run_for!(_response)
      { decision: 'pass', label: '0', data: '' }
    end
  end
end
