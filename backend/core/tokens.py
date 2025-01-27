import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, timezone, datetime
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from enums.TokenEnums import TokenEnum, TOKEN_EXPIRATION
from dotenv import load_dotenv

from core.redis.redis_services import store_user_token, is_in_store


load_dotenv()

# OAuth2 schema;
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create a single token (by Provided type);
async def create_token(user_id: int, token_type: TokenEnum, expires_delta: timedelta):
    if token_type not in [TokenEnum.ACCESS, TokenEnum.REFRESH]:
        raise HTTPException(detail="Invalid token type.", status_code=400)
    
    encode = {"id": user_id, "type": token_type}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})
    
    token = jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

    if token_type == TokenEnum.ACCESS:
        await store_user_token(
            user_id=user_id, 
            access_token=token, 
            access_expiration=int(expires_delta.total_seconds())
        )

    else: 
        await store_user_token(
            user_id=user_id, 
            refresh_token=token, 
            refresh_expiration=int(expires_delta.total_seconds())
        )

    return token

async def create_access_refresh_tokens(user_id: int):
    access_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.ACCESS])
    access_token = await create_token(user_id, TokenEnum.ACCESS, access_expires_delta)
    
    refresh_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.REFRESH])
    refresh_token = await create_token(user_id, TokenEnum.REFRESH, refresh_expires_delta)
    
    return {"access_token": access_token, "refresh_token": refresh_token}

async def get_user_by_token(token: str = Depends(oauth2_bearer)):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        token_type = payload.get("type")
        user_id = payload.get("id")
        return token_type, user_id
    
    except ExpiredSignatureError:
        raise HTTPException(detail="Token has expired.", status_code=401)
    except JWTError:
        raise HTTPException(detail="Invalid token.", status_code=401)

async def validate_token(token: str = Depends(oauth2_bearer)) -> int:
    token_type, user_id = await get_user_by_token(token)

    if token_type == TokenEnum.ACCESS:
        if not await is_in_store(user_id=user_id, access_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    elif token_type == TokenEnum.REFRESH:
        if not await is_in_store(user_id=user_id, refresh_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    else:
        raise HTTPException(detail="Invalid token type.", status_code=400)
    
    return user_id


async def refresh_access_token(refresh_token: str = Depends(oauth2_bearer)):
    user_id = await validate_token(refresh_token)
    return await create_access_refresh_tokens(user_id)