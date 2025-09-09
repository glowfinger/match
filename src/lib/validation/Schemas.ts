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

export const matchTeamSchema = z.object({
	club: z.string().min(1),
	squad: z.string().min(1),
});

export const matchOpponentSchema = z.object({
	club: z.string().min(1),
	squad: z.string().min(1),
});

const MAX_SCORE = 999;

export const matchResultSchema = z.object({
	homeScore: z.number().min(0).max(MAX_SCORE),
	awayScore: z.number().min(0).max(MAX_SCORE),
});
