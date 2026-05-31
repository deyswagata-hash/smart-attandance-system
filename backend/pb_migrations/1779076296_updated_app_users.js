/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3362450114")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_mqag29obzr` ON `app_users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_mqag29obzr` ON `app_users` (`email`) WHERE `email` != ''",
      "CREATE UNIQUE INDEX idx_college_id ON app_users (college_id) WHERE college_id IS NOT NULL AND college_id != ''"
    ]
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3362450114")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_mqag29obzr` ON `app_users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_mqag29obzr` ON `app_users` (`email`) WHERE `email` != ''",
      "CREATE UNIQUE INDEX `idx_hZfSfYLrjr` ON `app_users` (`college_id`)"
    ]
  }, collection)

  return app.save(collection)
})
