from enum import Enum

class InpactTypeEnum(str, Enum):
    FEAT = "Feat"
    FIX = "Fix"
    REF = "Ref"
    DOCS = "Docs"
    STYLE = "Style"
    PERF = "Perf"
    TEST = "Test"
    REVERT = "Revert"
    WIP = "Wip"
    BUILD = "Build"
    MERGE = "Merge"