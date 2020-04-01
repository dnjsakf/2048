import traceback

from routes import app
from utils.pipelines.game import rank

from flask import request, jsonify
from utils.common.logging import getLogger, DEBUG
from utils.common.schemas import RankingSchema, RankingItemSchema
from utils.common.decorators.schemas import ParamsDecorator as params

logger = getLogger(__name__, level=DEBUG)

@app.route("/game/rank", methods=["GET"])
@params.args(RankingSchema)
def selectGameRanking(schema):
  result = None
  try:
    rank_list = rank.selectRanking(schema)
    result = {
    "success": True,
    "payload": {
      "rank_list": rank_list
      }
    }
  except Exception as e:
    result = {
      "success": False,
      "error": traceback.format_exc()
    }

  return result

@app.route("/game/rank", methods=["POST"])
@params.json(RankingItemSchema)
def insertGameRanking(schema):
  result = None

  try:
    rank.insertRanking(schema)

    result = {
      "success": True
    }
  except Exception as e:
    result = {
      "success": False,
      "error": traceback.format_exc()
    }
    logger.error( traceback.format_exc() )
    
  return result