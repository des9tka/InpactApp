import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, timezone, datetime
from jose import jwt, JWTError
from enums.TokenEnums import ACCESS_TOKEN_TYPE, REFRESH_TOKEN_TYPE, TokenEnum
from dotenv import load_dotenv


load_dotenv()

# OAuth2 schema;
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")


# Create a single token (access or refresh);
async def create_token(user_id: int, token_type: TokenEnum, expires_delta: timedelta):
    encode = {"id": user_id, "type": token_type.value}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})

    return jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))


# Create Access and Refresh Tokens;
async def create_access_refresh_tokens(user_id: int):

    access_expires_delta = timedelta(hours=ACCESS_TOKEN_TYPE.EXPIRES_TIME.value)
    access_token = await create_token(user_id, TokenEnum.ACCESS, access_expires_delta)

    refresh_expires_delta = timedelta(hours=REFRESH_TOKEN_TYPE.EXPIRES_TIME.value)
    refresh_token = await create_token(user_id, TokenEnum.REFRESH, refresh_expires_delta)

    return {"access_token": access_token, "refresh_token": refresh_token}


# Get User ID by Token;
async def get_user_id_by_token(token: str = Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("HS256")])
        token_type = payload.get("type")
        
        if token_type not in TokenEnum.__members__:
            raise HTTPException(detail="Invalid token type.", status_code=401)
        
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(detail="Couldn't validate user.", status_code=401)
        
        return user_id
    
    except JWTError:
        raise HTTPException(detail="Couldn't validate user.", status_code=401)


# Refresh Access Token using Refresh Token;
async def refresh_access_token(refresh_token: str = Depends(oauth2_bearer)):
    try:
        
        payload = jwt.decode(refresh_token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("HS256")])
        token_type = payload.get("type")

        if token_type != TokenEnum.REFRESH.value:
            raise HTTPException(detail="Invalid token type.", status_code=401)
        
        user_id = payload.get("id")
        if not user_id:
            raise HTTPException(detail="Couldn't validate user.", status_code=401)

        access_expires_delta = timedelta(hours=ACCESS_TOKEN_TYPE.EXPIRES_TIME.value)
        new_access_token = await create_token(user_id, TokenEnum.ACCESS, access_expires_delta)

        return {"access_token": new_access_token}
    
    except JWTError:
        raise HTTPException(detail="Invalid refresh token.", status_code=401)
