from enum import Enum


# Enum for Token Types
class TokenEnum(str, Enum):
    ACCESS = "access"
    REFRESH = "refresh"

# Token expiration times
TOKEN_EXPIRATION = {
    TokenEnum.ACCESS: 1,  # hours
    TokenEnum.REFRESH: 2  # hours
}