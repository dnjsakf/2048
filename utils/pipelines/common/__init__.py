from utils.common.decorators.database import MongoDbDecorator as mongo

@mongo.connect("manage", "mn_menu_mst")
@mongo.select_one
def getMaxSortOrder(conn, target):
  return conn.aggregate([
    {
      "$group": { 
        "_id": "${}".format( target )
        , "max_sort_order": { "$max": "$sort_order" } 
      } 
    },
    {
        "$addFields": { 
            "sort_order": { "$toInt": { "$add": [ { "$toInt": "$max_sort_order" }, 1 ] } }
        } 
    },
    {
        "$project": {
            "_id": -1
            , "sort_order": 1
        }
    }
  ])