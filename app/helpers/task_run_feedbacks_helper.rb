module TaskRunFeedbacksHelper
  def stars_for(score)
    if score
      stars = []
      score.times { stars << "<i class='fas fa-star'></i>" }
      "<div class='flex justify-start text-yellow-500'>#{stars.join("")}</div>".html_safe
    else
      "-"
    end
  end
end
