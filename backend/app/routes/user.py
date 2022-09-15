from app.utils.index import get_hashed_password, create_access_token, create_refresh_token, verify_password, verify_token
from app.utils.searilizer import serializeDict
from fastapi.encoders import jsonable_encoder
from fastapi import APIRouter,  Request, HTTPException, status, Depends, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.security import OAuth2PasswordBearer
from app.schemas.register import RegisterSchema
from app.schemas.token import TokenSchema
from app.schemas.user import User
from bson import ObjectId

user = APIRouter()

reuseable_oauth = OAuth2PasswordBearer(
    tokenUrl='/login',
    scheme_name='JWT'
)


@user.post('/register', response_description='user created successfully', status_code=status.HTTP_201_CREATED)
def create_user(req: Request, user: RegisterSchema = Body(...)):

    if req.app.database["users"].find_one({ "email" : user.email }):
        raise HTTPException(status_code=status.HTTP_409_CONFLICT , detail='user with this email already exist')

    user.password = get_hashed_password(user.password)
    user = req.app.database['users'].insert_one(jsonable_encoder(user))
    req.app.database['usersProfile'].insert_one(jsonable_encoder(User(user_id=str(user.inserted_id))))

    return {'success': True, 'msg': 'user created successfully'}


@user.post('/login', summary='Create access and refresh tokens for user', response_model=TokenSchema)
async def login(req: Request, credentials: OAuth2PasswordRequestForm = Depends()):

    user = req.app.database['users'].find_one({'email': credentials.username})

    if ((user is None) or (not verify_password(credentials.password, user['password']))):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST , detail='Incorrect email or password')

    profile = req.app.database['usersProfile'].find_one({ 'user_id' : str(user['_id']) })
    payload = {
        'id': str(user['_id']),
        'email': user['email'],
        'profile_id': str(profile['_id'])
    }
    return {
        'access_token': create_access_token(payload),
        'refresh_token': create_refresh_token(payload)
    }


@ user.get('/profile/{id}', response_description='Get User Profile by id')
def find_user_profile(id: str, req: Request, token: str = Depends(reuseable_oauth)):

    if not verify_token(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail='Invalid Token')

    try:
        if (profile := req.app.database['usersProfile'].find_one({'_id': ObjectId(id)})) is not None:
            return serializeDict(profile)
    except:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND , detail=f'User Profile with ID {id} not found')


@ user.put('/profile/{id}', response_description='Update a profile')
def update_user_profile(id: str, req: Request, user: User = Body(...), token: str = Depends(reuseable_oauth)):

    if not verify_token(token):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail='Invalid Token')
        
    try:
        user = { key: value for key, value in user.dict().items() if value is not None and key != 'user_id' }
        req.app.database['usersProfile'].find_one_and_update({'_id': ObjectId(id)}, { '$set': user })
        return {'success': True, 'msg': 'Profile Updated Sucessfully'}
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED , detail='fail to update profile')
