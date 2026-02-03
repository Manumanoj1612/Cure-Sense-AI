from pydantic import BaseModel
from typing import List, Optional

class SymptomCheckRequest(BaseModel):
    symptoms: List[str]
    age: int
    duration: str
    severity: str
