import ImpactTable from "@/components/DataTable/ImpactTable";
import { impactType } from "@/types"

export default function Home() {
	const data: impactType[] = [
		{
			description: "Description of the impact Description of the impact Description of the impact Description of the impact Description of the impact Description of the impact Description of the impactDescription of the impact Description of the impact Description of the impact Description of the impact Description of the impact Description of the impact Description of the impact м Description of the impact Description of the impactDescription of the impactDescription of the impact Description of the impactмDescription of the impact",
			id: 1,
			impactPercent: 30,
			project_id: 123,
			updated_at: null,
			title: "Impact Title",
			type: "FEAT", 
			user_id: 456,
			created_at: "2025-02-02",
		},
		{
			description: "Description of the impact",
			id: 2,
			impactPercent: 40,
			project_id: 123,
			updated_at: null,
			title: "Impact Title 2",
			type: "FIX", 
			user_id: 456,
			created_at: "2025-02-02",
		},
		{
			description: "Description of the impact",
			id: 3,
			impactPercent: 50,
			project_id: 123,
			updated_at: null,
			title: "Impact Title 3",
			type: "DOCS", 
			user_id: 456,
			created_at: "2025-02-02",
		},
		{
			description: "Description of the impact",
			id: 4,
			impactPercent: 60,
			project_id: 123,
			updated_at: null,
			title: "Impact Title 4",
			type: "STYLE", 
			user_id: 456,
			created_at: "2025-02-02",
		},
	];

	return (
		<div>
			<ImpactTable impacts={data} />
		</div>
	);
}
