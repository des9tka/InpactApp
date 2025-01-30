from enum import Enum


# Enum for Token Types;
class TokenEnum(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"
    ACTIVATE = "activate"
    RECOVERY = "recovery"

# Token expiration times;
TOKEN_EXPIRATION = {
    TokenEnum.ACCESS: 12,  # hours 
    TokenEnum.REFRESH: 24, # hours 
    TokenEnum.ACTIVATE: 12, # hours 
    TokenEnum.RECOVERY: 10 # minutes
}