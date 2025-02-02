import * as yup from "yup";

const projectValidationSchema = yup.object().shape({
	name: yup
		.string()
		.min(2, "Min 2 characters.")
		.max(50, "Max 50 characters.")
		.required("Name required."),
});

export { projectValidationSchema };
