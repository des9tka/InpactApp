from sqlmodel import Session, select, or_


class ImpactServiceStore:
    # Create Impact;
    @classmethod
    def createImpactService(cls, session: Session, impact_data):
        from models import ImpactModel
        
        project = ImpactModel(
			title=impact_data.title,
			description=impact_data.description,
            impactPercent=impact_data.impactPercent,
			type=impact_data.type,
            project_id=impact_data.project_id,
			user_id=impact_data.user_id       
		)	
        
        session.add(project)
        session.commit()
        session.refresh(project)
        return project


