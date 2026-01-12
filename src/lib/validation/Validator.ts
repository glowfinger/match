import { z } from 'zod';

export function isValid(values: object, schema: z.ZodTypeAny) {
	const result = schema.safeParse(values);
	return result.success;
}

export function getErrors(values: object, schema: z.ZodTypeAny) {
	const result = schema.safeParse(values);

	const errors: Record<string, string> = {};
	const fieldErrors = z.flattenError(result.error!).fieldErrors as Record<string, string[]>;

	for (const [key, value] of Object.entries(fieldErrors)) {
		errors[key] = value.join(', ');
	}

	return errors;
}
