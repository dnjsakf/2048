import datetime

from pymongo import UpdateOne
from utils.common.decorators.database import MongoDbDecorator as mongo
from utils.pipelines import common

@mongo.count("manage", "mn_menu_mst")
def getManageMenuListCount(*args, **kwargs):
  return kwargs["cond"] if "cond" in kwargs else None

@mongo.select_one("manage", "mn_menu_mst")
def selectManageMenuInfo(*args, **kwargs):
  menu_grp_id = kwargs["menu_grp_id"]
  menu_id = kwargs["menu_id"]

  return [
    {
      "$match": {
        "menu_grp_id": menu_grp_id,
        "menu_id": menu_id 
      }
    },
    {
      "$addFields": {
        "_id": { "$toString": "$_id" },
      }
    },
    {
      "$project": {
        "_id": 1
        , "menu_grp_id": 1
        , "menu_id": 1
        , "full_menu": 1
        , "menu_name": 1
        , "menu_index": 1
        , "sort_order": 1
      }
    }
  ]

@mongo.select("manage", "mn_menu_mst")
def selectManageMenuList(*args, **kwargs):
  skip = int(kwargs["skip"] if "skip" in kwargs else 1)
  rowsCount = int(kwargs["rowsCount"] if "rowsCount" in kwargs else 10)

  return [
    {
      "$addFields": {
        "_id": { "$toString": "$_id" },
      }
    },
    {
      "$project": {
        "_id": 1
        , "menu_grp_id": 1
        , "menu_id": 1
        , "full_menu": 1
        , "menu_name": 1
        , "menu_index": 1
        , "sort_order": 1
      }
    },
    { "$sort": { "sort_order": -1 } },
    { "$skip": skip-1 },
    { "$limit": rowsCount }
  ]

@mongo.connect("manage", "mn_menu_mst")
@mongo.upsert
def insertManageMenu(conn, menu):
  full_menu_arr = list()
  
  if menu.get("menu_grp_id") != "":
    menu_grp_id = menu.get("menu_grp_id")
    full_menu_arr.append( menu_grp_id )
  full_menu_arr.append(menu["menu_id"])

  if menu.get("sort_order") == "":
    sort_order = common.getMaxSortOrder("menu_grp_id")
    menu["sort_order"] = sort_order["sort_order"] if sort_order is not None else 0
  
  menu["full_menu"] = "/".join( full_menu_arr )
  menu["reg_dttm"] = datetime.datetime.now().strftime("%Y%m%d%H%M%s")


  operations = [
    UpdateOne(
      {
        "menu_grp_id": menu.get("menu_grp_id")
        , "menu_id": menu.get("menu_id")
      },
      {
        "$set": menu
      },
      upsert = True
    )
  ]
  return conn.bulk_write(operations)