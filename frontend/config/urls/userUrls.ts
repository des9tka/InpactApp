export const userUrls = {
	getUserBy: (id?: number, email?: string, username?: string) =>
		`/users?${
			id
				? "id=" + id + "&"
				: email
				? "email=" + email + "&"
				: username
				? "username=" + username
				: ""
		}`,

	updateUser: () => "/users/update",
};
