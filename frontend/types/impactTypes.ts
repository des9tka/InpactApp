type typesOfImpactType = {};

type impactType = {
	description: string;
	id: number;
	impactPercent: number;
	project_id: number;
	updated_at: string | null;
	title: string;
	type:
		| "FEAT"
		| "FIX"
		| "REF"
		| "DOCS"
		| "STYLE"
		| "PERF"
		| "TEST"
		| "REVERT"
		| "WIP"
		| "BUILD"
		| "MERGE";
	user_id: number;
	created_at: string;
};

export type { impactType };
