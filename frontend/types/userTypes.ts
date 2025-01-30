type userType = {
	id: number;
	email: string;
	password: string;
	username: string;
	name: string | null;
	surname: string | null;
	is_active: boolean;
	created_at: string;
	updated_at: string | null;
};

type userUpdateBodyType = {
	username?: string | null;
	name?: string | null;
	surname?: string | null;
};

export type { userType, userUpdateBodyType };
