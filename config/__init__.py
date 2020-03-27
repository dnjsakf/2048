import os
import platform
import config.database as db
import config.smtp as smtp

# Mac: Darwin, Windows: Windwos
SYSTEM_OS = platform.system()
DOT_ENV = os.path.join(os.path.abspath("config"), ".env")

CONNECT_URL_FMT="{protocol}://{host}:{port}/{database}"
CONNECT_AUTH_URL_FMT="{protocol}://{username}:{password}@{host}:{port}/{database}"
CONNECT_AUTH_URL_FMT_OPT="{protocol}://{username}:{password}@{host}/{database}?{options}"

LOGGING_LEVEL = "DEBUG"
LOGGING_PATH = os.path.abspath("logs")
LOGGING_FILE = True

MONGO_DATABASE = db.MONGO_DATABASE
# MONGO_CONNECT = CONNECT_AUTH_URL_FMT.format(
#   protocol=db.MONGO_PROTOCOL    # mongodb
#   , username=db.MONGO_USERNAME
#   , password=db.MONGO_PASSWORD
#   , host=db.MONGO_HOST
#   , port=db.MONGO_PORT
#   , database=db.MONGO_DATABASE
# )
MONGO_CONNECT = CONNECT_AUTH_URL_FMT_OPT.format(
  protocol=db.MONGO_PROTOCOL    # mongodb
  , username=db.MONGO_USERNAME
  , password=db.MONGO_PASSWORD
  , host=db.MONGO_HOST
  , options=db.MONGO_OPTIONS
  , database=db.MONGO_DATABASE
)

CELERY_BROKER = CONNECT_AUTH_URL_FMT.format(
  protocol=db.RABBITMQ_PROTOCOL    # amqp
  , username=db.RABBITMQ_USERNAME
  , password=db.RABBITMQ_PASSWORD
  , host=db.RABBITMQ_HOST
  , port=db.RABBITMQ_PORT
  , database=db.RABBITMQ_DATABASE
)

CELERY_BACKEND = CONNECT_URL_FMT.format(
  protocol=db.REDIS_PROTOCOL    # redis
  , host=db.REDIS_HOST
  , port=db.REDIS_PORT
  , database=db.REDIS_DATABASE
)

SELENIUM_DRIVER_PATH = os.path.join(os.path.abspath("utils/crawler/drivers"), "chromedriver")
SELENIUM_DRIVER_VERSION = "80.0.3987.16"


# SMTP 호스트, 포트 정보
SMTP_HOST = smtp.SMTP_HOST
SMTP_PORT = smtp.SMTP_PORT
SMTP_ADDRESS = ( SMTP_HOST, SMTP_PORT )
 
# SMTP 계정 정보
SMTP_USERNAME = smtp.SMTP_USERNAME
SMTP_PASSWORD = smtp.SMTP_PASSWORD
 
# 송신자 (name, address)
SMTP_FROM_ADDR = smtp.SMTP_FROM_ADDR

# 수신자 [ (name, address), ... ]
SMTP_TO_ADDRS = smtp.SMTP_TO_ADDRS


FLASK_CONFIG = os.path.join(os.path.abspath("config"), "flask_{env}.py")