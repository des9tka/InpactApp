import * as yup from "yup";

const userUpdateValidator = yup.object().shape({
	username: yup
		.string()
		.min(2, "Min 2 characters.")
		.max(50, "Max 50 characters."),

	name: yup.string().min(2, "Min 2 characters.").max(50, "Max 50 characters."),

	surname: yup
		.string()
		.min(2, "Min 2 characters.")
		.max(50, "Max 50 characters."),
});

export { userUpdateValidator };
