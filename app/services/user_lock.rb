class UserLock
  UNSAFE_THRESHOLD    = 5
  SENSITIVE_THRESHOLD = 10

  class << self
    def run!(user)
      return if user.account_locked?
      labels = tally_filter_labels_today(user)
      if too_many_unsafe?(labels) || too_many_sensitive?(labels)
        user.lock_account!
      end
    end

    def too_many_unsafe?(labels)
      labels["2"] && labels["2"] >= UNSAFE_THRESHOLD
    end

    def too_many_sensitive?(labels)
      labels["1"] && labels["1"] >= SENSITIVE_THRESHOLD
    end

    def tally_filter_labels_today(user)
      results_today_ids = results_today(user).pluck(:id)
      task_results      = fetch_task_results(results_today_ids)
      filter_labels_for(task_results).tally
    end

    def results_today(user)
      user.task_results.where('task_results.created_at > ?', Date.today.beginning_of_day)
    end

    def fetch_task_results(ids)
      TaskResult.where(id: ids).includes(:content_filter_results)
    end

    def filter_labels_for(task_results)
      task_results.map(&:content_filter_results).flatten.pluck(:label)
    end
  end
end
