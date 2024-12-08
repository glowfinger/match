import type { ZodSchema } from 'zod';

export function isValid(values: any, schema: ZodSchema) {
	const result = schema.safeParse(values);

	return result.success;
}

export function getErrors(values: any, schema: ZodSchema) {
	const result = schema.safeParse(values);

	if (!result.success) {
		const errors: any = result.error.issues.reduce((acc: any, issue: any) => {
			if (!acc[issue.path[0]]) {
				acc[issue.path[0]] = [];
			}
			acc[issue.path[0]].push(issue.message);
			return acc;
		}, {});

		Object.keys(errors).forEach((i) => (errors[i] = errors[i].join(', ')));

		return errors;
	}

	let errors: any = {};

	Object.keys(values).forEach((i) => (errors[i] = ''));

	return errors;
}
