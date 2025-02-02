from sqlmodel import Session, select
from fastapi import HTTPException
from sqlalchemy import and_

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
			raise HTTPException(status_code=404, detail="User or project not found")
		
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
		if not impact:
			raise HTTPException(status_code=404, detail="Impact not found")

		founder_query = select(ProjectModel).where(
			(ProjectModel.id == impact.project_id)
		)
		project = session.exec(founder_query).first()
		
		if impact.user_id != user_id and project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the owner of this impact")
		
		
		if impact_data.impactPercent:
			if impact_data.impactPercent > 0 and user_id != project.founder_id:
				impact_data.impactPercent = 0.0
				
		return ImpactModel.update_impact(
			session=session,
			impact_data=impact_data,
			impact_id=impact_id
		)

	@classmethod
	async def get_impacts_by_project_id(
		cls,
		session,
		token,
		project_id
	):
		user_id = await validate_token(token)

		query = select(UserProjectModel).where(
			and_(
				(UserProjectModel.user_id == user_id),
				(UserProjectModel.project_id == project_id)
			)
		)
		project = session.exec(query).first()
		
		if not project:
			raise HTTPException(status_code=400, detail="You are not the participant of this project")

		query = select(ProjectModel).where(
			(ProjectModel.id == project_id)
		)
		project = session.exec(query).first()
		
		if project.founder_id != user_id:
			query = select(ImpactModel).where(
				and_(
					ImpactModel.project_id == project_id,
					ImpactModel.user_id == user_id
				)
			)
		else: query = select(ImpactModel).where(
				ImpactModel.project_id == project_id,
			)

		impacts = session.exec(query).all()
		
		return impacts
	
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
			raise HTTPException(status_code=404, detail="Impact not found")
		
		project_query = select(ProjectModel).where(
			(ProjectModel.id == impact.project_id)
		)
		project = session.exec(project_query).first()
		
		if impact.user_id != user_id and project.founder_id != user_id:
			raise HTTPException(status_code=400, detail="You are not the owner of this impact")
		
		return ImpactModel.delete_impact(session=session, impact_id=impact_id)
		