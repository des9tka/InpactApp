from fastapi import APIRouter, Depends
from sqlmodel import Session
from typing import List

from core.db import get_session 
from core.tokens import oauth2_bearer
from models import ImpactModel
from repository import ImpactRepository
from enums import UpdateImpactDataEnum


# Impact Router;
impact_router = APIRouter(
	prefix="/impacts",
	tags=["impacts"]
)

# Create Impact;
@impact_router.post("/")
async def create_project(
	impact_data: ImpactModel,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> ImpactModel:
	return await ImpactRepository.create_impact(
		session=session,
		token=token,
		impact_data=impact_data,
	)

@impact_router.get("/for-project/{project_id}")
async def get_impacts_by_project_id(
	project_id: int,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> List[ImpactModel]:
	return await ImpactRepository.get_impacts_by_project_id(
		session=session,
		token=token,
		project_id=project_id
	)

@impact_router.patch("/update/{impact_id}")
async def update_project(
	impact_data: UpdateImpactDataEnum,
	impact_id: int,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
) -> ImpactModel:
	return await ImpactRepository.update_impact(session=session, token=token, impact_data=impact_data, impact_id=impact_id)

@impact_router.delete("/delete/{impact_id}")
async def delete_project(
	impact_id: int,
	session: Session = Depends(get_session),
	token: str = Depends(oauth2_bearer)
):
	return await ImpactRepository.delete_impact(session=session, token=token, impact_id=impact_id)