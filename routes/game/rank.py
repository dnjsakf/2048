import traceback

from routes import app
from utils.pipelines.game import rank

from flask import request, jsonify
from utils.common.logging import getLogger, DEBUG

logger = getLogger(__name__, level=DEBUG)

@app.route("/game/rank", methods=["GET"])
def selectGameRanking():
  result = None
  try:
    mode = request.args.get("mode")
    isMobile = request.args.get("isMobile")

    rank_list = rank.selectRanking(mode, isMobile)
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
def insertGameRanking():
  result = None

  try:
    form = dict(request.json)

    rank.insertRanking( form )

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