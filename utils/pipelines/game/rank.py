from utils.common.schemas import RankingSchema, RankingItemSchema
from utils.common.decorators.database import MongoDbDecorator as mongo

@mongo.select("2048", "game_ranking", RankingItemSchema)
def selectRanking(schema: RankingSchema):
  pipeline = []

  if schema is not None:
    pipeline.append({ "$match": {
        "mode": schema.get("mode"),
        "isMobile": schema.get("isMobile")
      }
    })
  pipeline.extend([
    { "$sort": {
        "score": -1,
        "runtime": 1,
        "reg_dttm": 1
      } 
    },
    { "$group": {
        "_id": "$mode",
        "items": { "$push": "$$ROOT" }
      }
    },
    { "$unwind": {
      "path": "$items", 
      "includeArrayIndex": "items.rank" 
      }
    },
    { "$replaceRoot": { 
        "newRoot": "$items" 
      }
    },
    { "$addFields": {
        "_id": { "$toString": "$_id" },
       "rank": { "$add": [ "$rank", 1 ] } 
      }
    },
    { "$limit": 30 }
  ])
  
  return pipeline


@mongo.insert_one("2048", "game_ranking")
def insertRanking(schema: RankingItemSchema):
  return schema
