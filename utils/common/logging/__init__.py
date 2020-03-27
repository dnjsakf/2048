import os
import logging
import datetime

from config import LOGGING_PATH, LOGGING_LEVEL, LOGGING_FILE

def getLogger(name, level=LOGGING_LEVEL, file=LOGGING_FILE):
  current_date = datetime.datetime.now().strftime("%Y%m%d")

  logger = logging.getLogger(name)
  logger.setLevel( level )

  formatter = logging.Formatter('[%(asctime)s][%(levelname)s][%(name)s] - %(message)s')
  stream_hander = logging.StreamHandler()
  stream_hander.setFormatter(formatter)
  logger.addHandler( stream_hander )

  if file == True:
    filename = os.path.join( LOGGING_PATH, "log_{}.log".format( current_date ) )
    file_handler = logging.FileHandler( filename )
    file_handler.setFormatter( formatter )
    logger.addHandler( file_handler )

  return logger

CRITICAL = 50
FATAL = CRITICAL
ERROR = 40
WARNING = 30
WARN = WARNING
INFO = 20
DEBUG = 10
NOTSET = 0