import datetime

from pymongo import UpdateOne
from utils.common.decorators.database import MongoDbDecorator as mongo
from utils.pipelines import common

from marshmallow import Schema, fields

class GameRankingSchema(Schema):
  _id = fields.Str()
  name = fields.Str()
  mode = fields.Str()
  score = fields.Integer()
  runtime = fields.Integer()
  rank = fields.Integer()
  reg_dttm = fields.Str()

@mongo.insert_one("2048", "game_ranking", GameRankingSchema)
def insertRanking(info):
  info["reg_dttm"] = default=datetime.datetime.now().strftime("%Y%m%d%H%M%S")
  return info

@mongo.select("2048", "game_ranking", GameRankingSchema)
def selectRanking(mode):
  pipeline = []

  if mode is not None:
    pipeline.append({ "$match": {
        "mode": mode
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
    { "$limit": 10 }
  ])
  return pipeline