from pydantic import BaseModel, EmailStr, validator
import re


# REGISTER SCHEMA
class RegisterSchema(BaseModel):
    email: str = None
    password: str = None

    @validator('email')
    def valid_email(cls: BaseModel, email: str) -> EmailStr:
        regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        if not re.fullmatch(regex,email):
            raise ValueError(
                'Please enter a valid email'
            )
        return email

    @validator('password')
    def passwords_match(cls: BaseModel, password: str) -> str:
        regexp = r'[@#%]+[0-9]+@*[a-zA-Z]+'
        sorted_x = ''.join(sorted(password))
        if '@' in sorted_x:
            sorted_x = '@%s' % sorted_x
        p = re.compile(regexp)
        if p.match(sorted_x) is None:
            raise ValueError(
                'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters'
            )
        return password
