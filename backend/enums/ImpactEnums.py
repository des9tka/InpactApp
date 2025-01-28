from enum import Enum

class ImpactTypeEnum(str, Enum):
    FEAT = "feat"
    FIX = "fix"
    REF = "ref"
    DOCS = "docs"
    STYLE = "style"
    PERF = "perf"
    TEST = "test"
    REVERT = "revert"
    WIP = "wip"
    BUILD = "build"
    MERGE = "merge"