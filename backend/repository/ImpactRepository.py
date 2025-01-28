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
		impact_data.impactPercent = 0.0	
		
		return ImpactModel.create_impact(
			session=session,
			impact_data=impact_data
		)

	@classmethod
	async def update_impact(
		cls,
		session,
		token,
		impact_data,
		impact_id
	) -> ImpactModel:
		user_id = await validate_token(token)
		
		impact_query = select(ImpactModel).where(
			(ImpactModel.id == impact_id)
        )
		impact = session.exec(impact_query).first()

		founder_query = select(ProjectModel).where(
			(ProjectModel.id == impact.project_id)
		)
		project = session.exec(founder_query).first()

		if not impact:
			raise HTTPException(status_code=404, detail="Impact not found.")
		
		if impact.user_id != user_id and project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the owner of this impact.")
		
		if impact_data.impactPercent:
			if impact_data.impactPercent > 0 and impact.user_id == user_id:
				impact_data.impactPercent = 0.0
				
		return ImpactModel.update_impact(
			session=session,
			impact_data=impact_data,
			impact_id=impact_id
		)
	
	@classmethod
	async def delete_impact(
		cls,
		session,
		token,
		impact_id
	) -> ImpactModel:
		user_id = await validate_token(token)
		
		impact_query = select(ImpactModel).where(
			(ImpactModel.id == impact_id)
		)
		impact = session.exec(impact_query).first()

		if not impact:
			raise HTTPException(status_code=404, detail="Impact not found.")
		
		project_query = select(ProjectModel).where(
			(ProjectModel.id == impact.project_id)
		)
		project = session.exec(project_query).first()
		
		if impact.user_id != user_id and project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the owner of this impact.")
		
		return ImpactModel.delete_impact(session=session, impact_id=impact_id)