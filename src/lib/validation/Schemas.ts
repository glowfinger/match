import exp from 'constants';
import { z } from 'zod';

export const matchSchema = z.object({
	matchOn: z.string().date(),
	type: z.string().min(1),
	team: z.string().min(1),
	squad: z.string().min(1).max(64),
});

export const matchScheduleSchema = z.object({
	matchOn: z.string().min(1).max(10),
	meetAt: z.string().min(1).max(5),
	kickOffAt: z.string().min(1).max(5),
});

export const matchDetailSchema = z.object({
	venue: z.string().min(1),
	type: z.string().min(1),
	address: z.string().min(1),
});
