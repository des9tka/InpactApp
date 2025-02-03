import * as yup from "yup";

const impactValidationSchema = yup.object().shape({
	title: yup
		.string()
		.min(2, "Title must be at least 2 characters long.")
		.max(50, "Title must be at most 50 characters long.")
		.required("Title is required."),
	type: yup
		.string()
		.oneOf(
			[
				"FEAT",
				"FIX",
				"REF",
				"DOCS",
				"STYLE",
				"PERF",
				"TEST",
				"REVERT",
				"WIP",
				"BUILD",
				"MERGE",
			],
			"Invalid impact type. Allowed values are: FEAT, FIX, REF, DOCS, STYLE, PERF, TEST, REVERT, WIP, BUILD, MERGE."
		)
		.required("Type is required."),
	description: yup
		.string()
		.min(2, "Description must be at least 2 characters long.")
		.max(500, "Description must be at most 500 characters long.")
		.required("Description is required."),
	impactPercent: yup
		.number()
		.min(0, "Impact percent must be between 0 and 100.")
		.max(100, "Impact percent must be between 0 and 100.")
		.required("Impact percent is required."),
});

export { impactValidationSchema };
