import { z } from 'zod';

export const matchSchema = z.object({
	matchOn: z.string().date(),
	type: z.string().min(1),
	team: z.string().min(1),
	squad: z.string().min(1).max(64),
});
