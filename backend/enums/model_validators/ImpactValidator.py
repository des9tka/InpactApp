from fastapi import HTTPException
import re
from enum import Enum

from enums.ImpactEnums import ImpactTypeEnum

def validate_title(title: str) -> str:
	if len(title) < 2 or not title:
		raise HTTPException(status_code=400, detail="Title must be at least 2 character long.")
	if len(title) > 50:
		raise HTTPException(status_code=400, detail="Title must be at most 50 characters long.")
	return title

def validate_type(type_value: str) -> str:
   	# Проверка на пустое значение
   	if not type_value or type_value not in ImpactTypeEnum.__members__:
   	    raise HTTPException(status_code=400, detail="Invalid impact type. Allowed values are: FEAT, FIX, REF, DOCS, STYLE, PERF, TEST, 	REVERT, WIP, BUILD, MERGE.")
   	return type_value

def validate_description(description: str) -> str:
    if len(description) < 2 or not description:
        raise HTTPException(status_code=400, detail="Description must be at least 2 character long.")
    if len(description) > 500:
        raise HTTPException(status_code=400, detail="Description must be at most 500 characters long.")
    return description

def validate_impact_percent(impact_percent: float) -> float:
    if impact_percent < 0 or impact_percent > 100:
        raise HTTPException(status_code=400, detail="Impact percent must be between 0 and 100.")
    return impact_percent
