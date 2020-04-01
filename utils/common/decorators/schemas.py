import traceback

from functools import wraps
from flask import request
from marshmallow import ValidationError

from utils.common.logging import getLogger, DEBUG

logger = getLogger(__name__, level=DEBUG)

class SchemaDecorator(object):
  def __init__(self, Schema):
    self.Schema = Schema

  def load(self, data):
    return self.Schema().load(data)
  
class ParamsDecorator(SchemaDecorator):
  @classmethod
  def args(cls, Schema):
    def decorator(func):
      @wraps(func)
      def wrapper(*args, **kwargs):
        try:
          schema = Schema().load(dict(request.args))
          return func(schema, *args, **kwargs)
        except ValidationError as err:
          logger.error( traceback.format_exc() )
          return ( err.messages, 422 )
      return wrapper
    return decorator

  @classmethod
  def json(cls, Schema):
    def decorator(func):
      @wraps(func)
      def wrapper(*args, **kwargs):
        try:
          schema = Schema().load(dict(request.json))
          return func(schema, *args, **kwargs)
        except ValidationError as err:
          logger.error( traceback.format_exc() )
          return (traceback.format_exc(), 422) #( err.messages, 422 )
      return wrapper
    return decorator