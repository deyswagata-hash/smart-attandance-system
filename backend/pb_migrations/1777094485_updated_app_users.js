/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("pbc_3362450114")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_mqag29obzr` ON `app_users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_mqag29obzr` ON `app_users` (`email`) WHERE `email` != ''",
      "CREATE UNIQUE INDEX `idx_hZfSfYLrjr` ON `app_users` (`college_id`)"
    ]
  }, collection)

  // add field
  collection.fields.addAt(8, new Field({
    "autogeneratePattern": "",
    "hidden": false,
    "id": "text1996563634",
    "max": 0,
    "min": 0,
    "name": "college_id",
    "pattern": "",
    "presentable": false,
    "primaryKey": false,
    "required": false,
    "system": false,
    "type": "text"
  }))

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("pbc_3362450114")

  // update collection data
  unmarshal({
    "indexes": [
      "CREATE UNIQUE INDEX `idx_tokenKey_mqag29obzr` ON `app_users` (`tokenKey`)",
      "CREATE UNIQUE INDEX `idx_email_mqag29obzr` ON `app_users` (`email`) WHERE `email` != ''"
    ]
  }, collection)

  // remove field
  collection.fields.removeById("text1996563634")

  return app.save(collection)
})
