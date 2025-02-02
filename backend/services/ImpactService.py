from sqlmodel import Session
from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError
from datetime import date

from enums import ImpactTypeEnum

class ImpactServiceStore:
    # Create a new Impact
    @classmethod
    def createImpactService(cls, session: Session, impact_data):
        from models import ImpactModel
        
        # Validate impact type
        if impact_data.type:
            impact_type = impact_data.type.upper()  # Convert to uppercase
            
            if impact_type not in (value.value for value in ImpactTypeEnum):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid impact type '{impact_data.type}'. Valid values are: {', '.join(value.value for value in ImpactTypeEnum)}."
                )
            
            impact_data.type = impact_type
        
        # Create the impact instance and add to the session
        impact = ImpactModel(
            title=impact_data.title,
            description=impact_data.description,
            impactPercent=impact_data.impactPercent,
            type=impact_data.type,
            project_id=impact_data.project_id,
            user_id=impact_data.user_id       
        )
        
        session.add(impact)
        session.commit()  # Commit the changes to the database
        session.refresh(impact)  # Refresh the impact object with the data from the database
        return impact

    # Update an existing Impact
    @classmethod
    def updateImpactService(cls, session: Session, impact_data, impact_id):
        from models import ImpactModel

        # Get Impact by ID
        impact = session.get(ImpactModel, impact_id)
        if not impact:
            raise HTTPException(status_code=404, detail="Impact not found")

        # Update fields if provided
        impact.title = impact_data.title if impact_data.title else impact.title
        impact.description = impact_data.description if impact_data.description else impact.description
        impact.impactPercent = impact_data.impactPercent if impact_data.impactPercent else impact.impactPercent

        # Validate and update the impact type
        if impact_data.type:
            impact_type = impact_data.type.upper()  # Convert to uppercase
            
            if impact_type not in (value.value for value in ImpactTypeEnum):
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid impact type '{impact_data.type}'. Valid values are: {', '.join(value.value for value in ImpactTypeEnum)}."
                )
            
            impact.type = impact_type

        # If any field is updated, update the timestamp
        if any([impact_data.title, impact_data.description, impact_data.impactPercent, impact_data.type]):
            impact.updated_at = date.today()

            try:
                session.commit()  # Commit changes to the database
                session.refresh(impact)  # Refresh the impact object with the updated data
            except IntegrityError as e:
                session.rollback()  # Rollback in case of an error
                if "UNIQUE constraint failed" in str(e.orig):
                    raise HTTPException(
                        status_code=400, detail="Impact with these values already exists."
                    )
                raise HTTPException(
                    status_code=500, detail="An unexpected database error occurred."
                )

        return impact
    
    # Delete an Impact by ID
    @classmethod
    def deleteImpactService(cls, session: Session, impact_id):
        from models import ImpactModel
         
        # Get Impact by ID
        impact = session.get(ImpactModel, impact_id)
        if not impact:
            raise HTTPException(status_code=404, detail="Impact not found")

        session.delete(impact)  # Delete the impact from the session
        session.commit()  # Commit the changes to the database
        return {"detail": f"Impact with id {impact_id} has been deleted."}
