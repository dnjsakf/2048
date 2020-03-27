import traceback

from utils.common import logging

from pymongo import MongoClient
from config import MONGO_CONNECT

logger = logging.getLogger("{}.MongoDB".format(__name__))

class MongoDB(object):
  conn = None
    
  @classmethod
  def connect(cls, *args, **kwargs):
    cls.conn = None
    try:
      cls.conn = MongoClient(MONGO_CONNECT, maxPoolSize=10)

      logger.debug( cls.conn.server_info() )
      logger.info( "MongoDB connected." )
    except Exception as e:
      logger.error( traceback.format_exc() )
    finally:
      return cls.conn

  @classmethod
  def close(cls):
    if cls.conn is not None:
      cls.conn.close()
    logger.info( "MongoDB disconnected." )

  @classmethod
  def clear(cls):
    cls.close()
    cls.conn = None
    logger.info( "MongoDB clear." )

  