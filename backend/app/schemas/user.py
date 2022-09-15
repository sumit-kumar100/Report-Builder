from typing import Optional, List
from pydantic import BaseModel, validator


# User Skills
class UserSkill(BaseModel):
    name: str
    rating: int


# User Projects
class UserProject(BaseModel):
    title: str
    description: str
    skills: List[UserSkill]


# User Model
class User(BaseModel):
    first_name: Optional[str]
    last_name: Optional[str]
    mobile: Optional[str]
    address: Optional[str]
    about: Optional[str]
    skills: Optional[List[UserSkill]] 
    projects: Optional[List[UserProject]]
    user_id: Optional[str]

    @validator('first_name')
    def is_alpha_first_name(cls: BaseModel, first_name: str) -> str:
        if not first_name.isalpha():
            raise ValueError('Please Enter valid name.')
        return first_name

    @validator('last_name')
    def is_alpha_last_name(cls: BaseModel, last_name: str) -> str:
        if not last_name.isalpha():
            raise ValueError('Please Enter valid name.')
        return last_name

    @validator('mobile')
    def mobile_verify(cls: BaseModel, mobile: str) -> str:
        if len(mobile) != 10:
            raise ValueError('Please Enter a valid Phone number.')
        return mobile
