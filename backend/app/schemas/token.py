from pydantic import BaseModel


# TOKEN SCHEMA
class TokenSchema(BaseModel):
    access_token: str
    refresh_token: str


# TOKEN PAYLOAD
class TokenPayload(BaseModel):
    sub: str = None
    exp: int = None
