from enum import Enum
from pydantic import BaseModel
from typing import Optional


class ImpactTypeEnum(str, Enum):
    FEAT = "FEAT"
    FIX = "FIX" 
    REF = "REF"
    DOCS = "DOCS"
    STYLE = "STYLE"
    PERF = "PERF"
    TEST = "TEST"
    REVERT = "REVERT"
    WIP = "WIP"
    BUILD = "BUILD"
    MERGE = "MERGE"

class UpdateImpactDataEnum(BaseModel):
	title: Optional[str] = None
	description: Optional[str] = None
	type: Optional[ImpactTypeEnum] = None
	impactPercent: Optional[float] = None
