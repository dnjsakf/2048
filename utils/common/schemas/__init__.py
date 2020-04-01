import datetime

from marshmallow import Schema, fields, validate

class RankingSchema(Schema):
  _id = fields.Str()
  isMobile = fields.Boolean()
  name = fields.Str()
  mode = fields.Str()
  score = fields.Integer()
  runtime = fields.Integer()
  rank = fields.Integer()
  reg_dttm = fields.Method(
    default=lambda: datetime.datetime.now().strftime("%Y%m%d%H%M%S"),
    missing=lambda: datetime.datetime.now().strftime("%Y%m%d%H%M%S"),
    required=False,
    allow_none=False,
    deserialize="parse_date"
  )

  def parse_date(self, reg_dttm=None):
    return datetime.datetime.strptime(reg_dttm[:8], "%Y%m%d").strftime("%Y-%m-%d")

class RankingItemSchema(RankingSchema):
  name = fields.Str(required=True, validate=[validate.Length(min=1, max=20)])
  mode = fields.Str(required=True)
  score = fields.Integer(required=True)

