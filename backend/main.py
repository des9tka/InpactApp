from fastapi import FastAPI, HTTPException, Query
from typing import List, Optional

app = FastAPI()


# @app.get("/inpacts", response_model=List[InpactModel])
# async def get_inpacts(
#     type: Optional[InpactTypeModel] = None,
#     title: Optional[str] = None,
#     description: Optional[str] = None
# ) -> List[InpactModel]:
    
#     filtered_data = INPACTS
    
#     if type:
#         filtered_data = [inpact for inpact in filtered_data if inpact["type"] == type.value]
#     if description:
#         filtered_data = [inpact for inpact in filtered_data if description in inpact["description"]]
        
#     return filtered_data


# @app.get("/inpacts/{inpact_id}")
# async def get_inpact(inpact_id: int) -> InpactModel:
      
# 	for inpact in INPACTS:
# 		if inpact["id"] == inpact_id:
# 			return inpact
            
# 	raise HTTPException(status_code=404, detail={"msg": "Inpact was not found!"})
