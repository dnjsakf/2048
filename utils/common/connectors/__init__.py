from utils.common import logging
from utils.common.connectors.mongo import MongoDB

logger = logging.getLogger("{}.Connector".format(__name__))

class Connector(object):
  database = None
  conn = None

  @classmethod
  def connect(cls, dbms, *args, **kwargs):
    if dbms == "mongo" and cls.database != MongoDB:
      cls.database = MongoDB
      cls.conn = cls.database.connect()
    elif dbms == "others":
      pass

    return cls.conn

  @classmethod
  def close(cls):
    MongoDB.close()
    if( cls.database is not None ):
      cls.database.close()
    if( cls.conn is not None ):
      cls.conn.close()
    logger.info( "MongoDB disconnected." )

  @classmethod
  def clear(cls):
    MongoDB.clear()
    cls.close()
    cls.database = None
    cls.conn = None
    logger.info( "MongoDB clear." )