from fastapi.testclient import TestClient
from main import app
from jose import jwt
from utils.index import ALGORITHM , JWT_SECRET_KEY

client = TestClient(app)

def test_create_user():
    with TestClient(app) as client:
        response = client.post("/register", json={
            "email": "test@gmail.com",
            "password":"test123#"
        })
        assert response.status_code == 201
        assert response.json() == {'success': True, 'msg': 'user created successfully'}


def test_create_valid_email():
    with TestClient(app) as client:
        response = client.post("/register", json={
            "email": "testgmail.com", 
            "password":"test123#"
        })
        assert response.status_code == 422
        assert response.json() == {'detail': [{'loc': ['body', 'email'], 'msg': 'Please enter a valid email', 'type': 'value_error'}]}


def test_create_unique_email():
    with TestClient(app) as client:
        response = client.post("/register", json={
            "email": "test@gmail.com",
            "password":"test123#"
        })
        assert response.status_code == 409
        assert response.json() == {'detail': 'user with this email already exist'}


def test_create_valid_password():
    with TestClient(app) as client:
        response = client.post("/register", json={
            "email": "test@gmail.com", 
            "password":"test123"
        })
        assert response.status_code == 422
        assert response.json() == {'detail': [{'loc': ['body', 'password'], 'msg': 'Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters', 'type': 'value_error'}]}


def test_login():
    with TestClient(app) as client:
        response = client.post("/login", data={
            "username": "test@gmail.com", 
            "password":"test123#"
        })
        assert response.status_code == 200


def test_read_bad_token():
    with TestClient(app) as client:
        response = client.get("/profile/6322bd880b3adba1842ec389", headers={"Authorization": "bad-token"})
        assert response.status_code == 401
        assert response.json() == {'detail': 'Not authenticated'}


def test_read_invalid_token():
    with TestClient(app) as client:
        response = client.get("/profile/6322bd880b3adba1842ec389", headers={"Authorization": "Bearer bad-token"})
        assert response.status_code == 401
        assert response.json() == {'detail': 'Invalid Token'}


def test_read_inexisting_profile():
    with TestClient(app) as client:
        authorize = client.post("/login", data={"username": "test@gmail.com", "password":"test123#"})
        token = authorize.json()
        response = client.get("/profile/invalid-profile-id", headers={"Authorization": f"Bearer {token.get('access_token')}"})
        assert response.status_code == 404
        assert response.json() == {'detail': 'User Profile with ID invalid-profile-id not found'}


def test_create_valid_first_name():
    with TestClient(app) as client:
        authorize = client.post("/login", data={"username": "test@gmail.com", "password":"test123#"})
        token = authorize.json()
        user = jwt.decode(token.get('access_token'),JWT_SECRET_KEY,ALGORITHM)
        response = client.put(f"/profile/{user['profile_id']}",json={"first_name":"INVALID_NAME_123"}, headers={"Authorization": f"Bearer {token.get('access_token')}"})
        assert response.status_code == 422
        assert response.json() == {'detail': [{'loc': ['body', 'first_name'], 'msg': 'Please Enter valid name.', 'type': 'value_error'}]}

def test_create_valid_last_name():
    with TestClient(app) as client:
        authorize = client.post("/login", data={ "username": "test@gmail.com", "password":"test123#"})
        token = authorize.json()
        user = jwt.decode(token.get('access_token'),JWT_SECRET_KEY,ALGORITHM)
        response = client.put(f"/profile/{user['profile_id']}",json={"last_name":"INVALID_NAME_123"}, headers={"Authorization": f"Bearer {token.get('access_token')}"})
        assert response.status_code == 422
        assert response.json() == {'detail': [{'loc': ['body', 'last_name'], 'msg': 'Please Enter valid name.', 'type': 'value_error'}]}


def test_create_valid_mobile_no():
    with TestClient(app) as client:
        authorize = client.post("/login", data={ "username": "test@gmail.com", "password":"test123#"})
        token = authorize.json()
        user = jwt.decode(token.get('access_token'),JWT_SECRET_KEY,ALGORITHM)
        response = client.put(f"/profile/{user['profile_id']}",json={"mobile":"INVALID_NAME_123"}, headers={"Authorization": f"Bearer {token.get('access_token')}"})
        assert response.status_code == 422
        assert response.json() == {'detail': [{'loc': ['body', 'mobile'], 'msg': 'Please Enter a valid Phone number.', 'type': 'value_error'}]}

