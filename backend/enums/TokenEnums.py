from enum import Enum

class ACCESS_TOKEN_TYPE(Enum):
    TOKEN_TYPE = "access"
    EXPIRES_TIME = 24  # Hours

class REFRESH_TOKEN_TYPE(Enum):
    TOKEN_TYPE = "refresh"
    EXPIRES_TIME = 48  # Hours

# Перечень типов токенов
class TokenEnum(Enum):
    ACCESS = "access"
    REFRESH = "refresh"