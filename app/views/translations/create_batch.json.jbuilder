json.language @language
json.translations do
  json.partial! 'translations/translation', collection: @translations, as: :translation
end
