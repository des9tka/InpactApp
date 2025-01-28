from sqlmodel import Session, select
from fastapi import HTTPException

from core.tokens import validate_token
from models import ImpactModel, UserProjectModel, ProjectModel


class ImpactRepository:

	# Create Impact;
	@classmethod
	async def create_impact(
        cls,
        session,
		token,
		impact_data
    ) -> ImpactModel:
		user_id = await validate_token(token)
		
		query = select(UserProjectModel).where(
            (UserProjectModel.user_id == user_id) &
            (UserProjectModel.project_id == impact_data.project_id)
        )
		
		result = session.exec(query).first()

		if not result:
			raise HTTPException(status_code=404, detail="User or project not found.")
		
		impact_data.user_id = user_id	
		
		return ImpactModel.create_impact(
			session=session,
			impact_data=impact_data
		)
