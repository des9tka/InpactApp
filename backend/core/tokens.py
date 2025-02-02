import os
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from datetime import timedelta, timezone, datetime
from jose import jwt, JWTError
from jose.exceptions import ExpiredSignatureError
from enums.TokenEnums import TokenEnum, TOKEN_EXPIRATION
from dotenv import load_dotenv
from typing import Optional

from core.redis.redis_services import store_user_token, is_in_store, get_token_by_user_id


load_dotenv()

# OAuth2 schema;
oauth2_bearer = OAuth2PasswordBearer(tokenUrl="auth/login")

# Create a single token (by Provided type);
async def create_token(user_id: int, token_type: TokenEnum, expires_delta: timedelta, project_id: int = None):
    if token_type not in [TokenEnum.ACCESS, TokenEnum.REFRESH, TokenEnum.ACTIVATE, TokenEnum.RECOVERY, TokenEnum.INVITE]:
        raise HTTPException(detail="Invalid token type.", status_code=400)

    encode = {"id": user_id, "type": token_type, "project_id": project_id}
    expires = datetime.now(timezone.utc) + expires_delta
    encode.update({"exp": expires})

    token = jwt.encode(encode, os.getenv("SECRET_KEY"), algorithm=os.getenv("ALGORITHM"))

    if token_type == TokenEnum.ACCESS:
        await store_user_token(
            user_id=user_id, 
            access_token=token, 
            access_expiration=int(expires_delta.total_seconds())
        )

    elif token_type == TokenEnum.REFRESH: 
        await store_user_token(
            user_id=user_id, 
            refresh_token=token, 
            refresh_expiration=int(expires_delta.total_seconds())
        )

    elif token_type == TokenEnum.ACTIVATE: 
        await store_user_token(
            user_id=user_id, 
            activate_token=token, 
            activate_expiration=int(expires_delta.total_seconds())
        )

    elif token_type == TokenEnum.RECOVERY: 
        await store_user_token(
            user_id=user_id, 
            recovery_token=token, 
            recovery_expiration=int(expires_delta.total_seconds())
        )

    elif token_type == TokenEnum.INVITE: 
        await store_user_token(
            user_id=user_id, 
            invite_token=token, 
            invite_expiration=int(expires_delta.total_seconds()),
            project_id=project_id
        )

    return token

async def create_access_refresh_tokens(user_id: int):
    access_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.ACCESS])
    access_token = await create_token(user_id, TokenEnum.ACCESS, access_expires_delta)
    
    refresh_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.REFRESH])
    refresh_token = await create_token(user_id, TokenEnum.REFRESH, refresh_expires_delta)
    
    return {"access_token": access_token, "refresh_token": refresh_token}

async def get_user_by_token(token: str = Depends(oauth2_bearer), project_id: Optional[bool] = None):
    try:
        payload = jwt.decode(token, os.getenv("SECRET_KEY"), algorithms=[os.getenv("ALGORITHM")])
        print("payload: " + str(payload))
        token_type = payload.get("type")
        user_id = payload.get("id")
        if project_id:
            return user_id, payload.get("project_id"), token_type
        return token_type, user_id
    
    except ExpiredSignatureError:
        raise HTTPException(detail="Token has expired.", status_code=401)
    except JWTError:
        raise HTTPException(detail="Invalid token.", status_code=401)

async def validate_token(token: str = Depends(oauth2_bearer), project_id: Optional[int] = None) -> int:
    token_type, user_id = await get_user_by_token(token)

    if token_type == TokenEnum.ACCESS:
        if not await is_in_store(user_id=user_id, access_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    elif token_type == TokenEnum.REFRESH:
        if not await is_in_store(user_id=user_id, refresh_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    elif token_type == TokenEnum.ACTIVATE:
        if not await is_in_store(user_id=user_id, activate_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    elif token_type == TokenEnum.RECOVERY:
        if not await is_in_store(user_id=user_id, recovery_token=token):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    elif token_type == TokenEnum.INVITE:
        if not await is_in_store(user_id=user_id, invite_token=token, project_id=project_id):
            raise HTTPException(detail="Token is blacklisted.", status_code=401)
    else:
        raise HTTPException(detail="Invalid token type.", status_code=400)
    return user_id

async def refresh_access_token(refresh_token: str = Depends(oauth2_bearer)):
    user_id = await validate_token(refresh_token)
    return await create_access_refresh_tokens(user_id)

async def create_activate_token(user_id: int):
    access_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.ACTIVATE])
    return await create_token(user_id, TokenEnum.ACTIVATE, access_expires_delta) 

async def create_recovery_token(user_id: int):
    access_expires_delta = timedelta(minutes=TOKEN_EXPIRATION[TokenEnum.RECOVERY])
    return await create_token(user_id, TokenEnum.RECOVERY, access_expires_delta) 

async def create_invite_token(user_id: int, project_id: int):
    access_expires_delta = timedelta(hours=TOKEN_EXPIRATION[TokenEnum.INVITE])
    return await create_token(user_id, TokenEnum.INVITE, access_expires_delta, project_id) 

async def is_allowed_request(user_id: int, token_type: str, project_id: Optional[int] = None):
    if token_type == "activate":
        token = await get_token_by_user_id(user_id=user_id, token_type="activate")
        return not await is_in_store(user_id=user_id, activate_token=token)
    elif token_type == "recovery":
        token = await get_token_by_user_id(user_id=user_id, token_type="recovery")
        return not await is_in_store(user_id=user_id, recovery_token=token)
    elif token_type == "invite":
        token = await get_token_by_user_id(user_id=user_id, token_type="invite", project_id=project_id)
        return not await is_in_store(user_id=user_id, invite_token=token, project_id=project_id)
    else:
        raise HTTPException(detail="Invalid token type.", status_code=400)

