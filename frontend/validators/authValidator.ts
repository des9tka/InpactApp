import * as yup from "yup";

const passwordRegExp =
	/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\s])[^\s]{4,20}$/;

const authRegisterValidationSchema = yup.object().shape({
	email: yup
		.string()
		.min(2)
		.max(100)
		.email("Invalid email.")
		.required("Email required."),

	username: yup.string().min(2).max(50).required("Username required."),

	password: yup
		.string()
		.min(2)
		.max(100)
		.matches(passwordRegExp, {
			message:
				"Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
		})
		.required("Password required."),

	name: yup.string().min(2).max(50),

	surname: yup.string().min(2).max(50),
});

const authLoginValidationSchema = yup.object().shape({
	email: yup
		.string()
		.min(2)
		.max(100)
		.email("Invalid email.")
		.required("Email required."),

	password: yup
		.string()
		.min(2)
		.max(100)
		.matches(passwordRegExp, {
			message:
				"Password must include 1 uppercase, 1 lowercase, 1 digit, and 1 special character.",
		})
		.required("Password required."),
});

export { authLoginValidationSchema, authRegisterValidationSchema };
