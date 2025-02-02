from sqlmodel import Session, select
from fastapi import HTTPException
from sqlalchemy import and_

from core.tokens import validate_token
from models import ImpactModel, UserProjectModel, ProjectModel


class ImpactRepository:

    # Create Impact
    @classmethod
    async def create_impact(cls, session, token, impact_data) -> ImpactModel:
        # Validate token and get the user ID
        user_id = await validate_token(token)
        
        # Check if the user is a participant in the project
        query = select(UserProjectModel).where(
            (UserProjectModel.user_id == user_id) & 
            (UserProjectModel.project_id == impact_data.project_id)
        )
        result = session.exec(query).first()

        if not result:
            raise HTTPException(status_code=404, detail="User or project not found")
        
        # Set the user ID and default impact percentage
        impact_data.user_id = user_id
        impact_data.impactPercent = 0.0  # Default impact percentage
        
        # Create and return the impact
        return ImpactModel.create_impact(session=session, impact_data=impact_data)

    # Update Impact
    @classmethod
    async def update_impact(cls, session, token, impact_data, impact_id) -> ImpactModel:
        # Validate token and get the user ID
        user_id = await validate_token(token)
        
        # Retrieve the existing impact
        impact = session.exec(select(ImpactModel).where(ImpactModel.id == impact_id)).first()
        if not impact:
            raise HTTPException(status_code=404, detail="Impact not found")

        # Retrieve the project associated with the impact
        project = session.exec(select(ProjectModel).where(ProjectModel.id == impact.project_id)).first()
        
        # Check if the user is the impact owner or the project founder
        if impact.user_id != user_id and project.founder_id != user_id:
            raise HTTPException(status_code=400, detail="You are not the owner of this impact")

        # Prevent non-founders from setting a positive impact percentage
        if impact_data.impactPercent and impact_data.impactPercent > 0 and user_id != project.founder_id:
            impact_data.impactPercent = 0.0  # Reset the impact percentage for non-founders

        # Update and return the impact
        return ImpactModel.update_impact(session=session, impact_data=impact_data, impact_id=impact_id)

    # Get Impacts by Project ID
    @classmethod
    async def get_impacts_by_project_id(cls, session, token, project_id):
        # Validate token and get the user ID
        user_id = await validate_token(token)

        # Check if the user is a participant in the project
        project = session.exec(select(UserProjectModel).where(
            and_(UserProjectModel.user_id == user_id, UserProjectModel.project_id == project_id)
        )).first()

        if not project:
            raise HTTPException(status_code=400, detail="You are not the participant of this project")

        # Retrieve project details
        project = session.exec(select(ProjectModel).where(ProjectModel.id == project_id)).first()

        # If the user is the project founder, return all impacts for the project
        if project.founder_id == user_id:
            impacts = session.exec(select(ImpactModel).where(ImpactModel.project_id == project_id)).all()
        else:
            # Otherwise, return only the user's impact for the project
            impacts = session.exec(select(ImpactModel).where(
                and_(ImpactModel.project_id == project_id, ImpactModel.user_id == user_id)
            )).all()

        return impacts

    # Delete Impact
    @classmethod
    async def delete_impact(cls, session, token, impact_id) -> ImpactModel:
        # Validate token and get the user ID
        user_id = await validate_token(token)
        
        # Retrieve the impact and check if it exists
        impact = session.exec(select(ImpactModel).where(ImpactModel.id == impact_id)).first()
        if not impact:
            raise HTTPException(status_code=404, detail="Impact not found")
        
        # Retrieve the project associated with the impact
        project = session.exec(select(ProjectModel).where(ProjectModel.id == impact.project_id)).first()
        
        # Check if the user is the impact owner or the project founder
        if impact.user_id != user_id and project.founder_id != user_id:
            raise HTTPException(status_code=400, detail="You are not the owner of this impact")
        
        # Delete the impact and return the result
        return ImpactModel.delete_impact(session=session, impact_id=impact_id)
