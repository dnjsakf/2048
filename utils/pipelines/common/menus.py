from utils.common.decorators.database import MongoDbDecorator as mongo

@mongo.select("manage", "mn_menu_mst")
def selectMenuList(*args, **kwargs):
  return [
    {
      "$graphLookup": {
        "from": "mn_menu_mst",
        "startWith": "$menu_id",
        "connectFromField": "menu_id",
        "connectToField": "menu_grp_id",
        "as": "child_menus",
        "maxDepth": 4,
        "depthField": "level"
      }
    },
    {
      "$addFields": {
        "_id": { "$toString": "$_id" }
        , "child_menus._id": { "$toString": "$_id" }
        , "child_count": { "$cond": { "if": { "$isArray": "$child_menus" }, "then": { "$size": "$child_menus" }, "else": 0} }  
      }
    },
    {
      "$match": {
        "child_count": { "$gt": 0 }
      }
    },
    {
      "$project": {
        "_id": 1
        , "menu_grp_id": 1
        , "menu_id": 1
        , "full_menu": 1
        , "menu_name": 1
        , "sort_order": 1
        , "menu_index": 1
        , "child_menus._id": 1
        , "child_menus.menu_grp_id": 1
        , "child_menus.menu_id": 1
        , "child_menus.full_menu": 1
        , "child_menus.menu_name": 1
        , "child_menus.menu_index": 1
        , "child_menus.sort_order": 1
      }
    },
    { "$sort": { "sort_orer": 1 } }
  ]