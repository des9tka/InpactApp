import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, timezone, datetime
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from enums.TokenEnums import TokenEnum, TOKEN_EXPIRATION
from dotenv import load_dotenv

from core.redis import store_user_token, is_token_blacklisted


load_dotenv()

# OAuth2 schema;
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create a single token (by Provided type);
async def create_token(user_id: int, token_type: TokenEnum, expires_delta: timedelta):
    encode = {"id": user_id, "type": token_type}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    
    token = jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))
    await store_user_token(user_id, token, int(expires_delta.total_seconds()))
    
    return token

async def create_access_refresh_tokens(user_id: int):
    access_expires_delta = timedelta(minutes=TOKEN_EXPIRATION[TokenEnum.ACCESS])
    access_token = await create_token(user_id, TokenEnum.ACCESS, access_expires_delta)
    
    refresh_expires_delta = timedelta(minutes=TOKEN_EXPIRATION[TokenEnum.REFRESH])
    refresh_token = await create_token(user_id, TokenEnum.REFRESH, refresh_expires_delta)
    
    return {"access_token": access_token, "refresh_token": refresh_token}

async def verify_token(token: str = Depends(oauth2_bearer)):
    if await is_token_blacklisted(token):
        raise HTTPException(detail="Token is blacklisted.", status_code=401)
        
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        token_type = payload.get("type")
        user_id = payload.get("id")
        
        if token_type not in TokenEnum._value2member_map_ or not user_id:
            raise HTTPException(detail="Invalid token.", status_code=401)
            
        return user_id
    except ExpiredSignatureError:
        raise HTTPException(detail="Token has expired.", status_code=401)
    except JWTError:
        raise HTTPException(detail="Invalid token.", status_code=401)

async def refresh_access_token(refresh_token: str = Depends(oauth2_bearer)):
    user_id = await verify_token(refresh_token)
    return await create_access_refresh_tokens(user_id)