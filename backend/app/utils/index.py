from passlib.context import CryptContext
from dotenv import dotenv_values
from app.schemas.token import TokenPayload
from datetime import datetime, timedelta
from typing import Dict, Union, Any
from jose import jwt

config = dotenv_values(".env")

ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 30

ALGORITHM = "HS256"

JWT_SECRET_KEY = config['JWT_SECRET_KEY']

JWT_REFRESH_SECRET_KEY = config['JWT_REFRESH_SECRET_KEY']

password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def get_hashed_password(password: str) -> str:
    return password_context.hash(password)


def verify_password(password: str, hashed_pass: str) -> bool:
    return password_context.verify(password, hashed_pass)


def create_access_token(subject: Dict, expire: int = None) -> str:
    expire = datetime.utcnow() + expire if expire is not None else datetime.utcnow() + \
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, **subject}
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def create_refresh_token(subject: Union[str, Any], expire: int = None) -> str:
    expire = datetime.utcnow() + expire if expire is not None else datetime.utcnow() + \
        timedelta(minutes=REFRESH_TOKEN_EXPIRE_MINUTES)
    to_encode = {"exp": expire, **subject}
    encoded_jwt = jwt.encode(to_encode, JWT_REFRESH_SECRET_KEY, ALGORITHM)
    return encoded_jwt


def verify_token(token: str) -> bool:
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        token_data = TokenPayload(**payload)
        if datetime.fromtimestamp(token_data.exp) < datetime.now():
            return False
        return True
    except:
        return False
