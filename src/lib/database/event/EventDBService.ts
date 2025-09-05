import { db } from '$lib/database/IndexedDB';
import catchError from '$lib/helpers/CatchError';
import type { Event, EventDetails, EventPost } from '$lib/types/Event';

export async function addEvent(
	userAgent: string,
): Promise<[Error, undefined] | [undefined, string]> {
	const createdAt = new Date().toISOString();
	const uuid = crypto.randomUUID();
	return await catchError(db.events.add({ uuid, createdAt, userAgent, template: '' }));
}

export async function getEvents(): Promise<[Error, undefined] | [undefined, Event[]]> {
	return await catchError(db.events.toArray());
}

export async function getEvent(uuid: string): Promise<[Error, undefined] | [undefined, Event]> {
	const [error, event] = await catchError(db.events.get(uuid));
	if (error || !event) {
		return [error ?? new Error('Event not found'), undefined];
	}
	return [undefined, event];
}

export async function updateEvenDetails(
	uuid: string,
	details: EventDetails,
): Promise<[Error, undefined] | [undefined, Event]> {
	const [error, event] = await getEvent(uuid);
	if (error || !event) {
		return [error ?? new Error('Event not found'), undefined];
	}
	event.details = details;
	const [updateError, updatedEvent] = await catchError(db.events.update(uuid, event));
	if (updateError || !updatedEvent) {
		return [updateError ?? new Error('Event not found'), undefined];
	}
	return [undefined, updatedEvent as unknown as Event];
}

export async function updateEvenPost(
	uuid: string,
	post: EventPost,
): Promise<[Error, undefined] | [undefined, Event]> {
	const [error, event] = await getEvent(uuid);
	if (error || !event) {
		return [error ?? new Error('Event not found'), undefined];
	}
	event.post = post;
	const [updateError, updatedEvent] = await catchError(db.events.update(uuid, event));
	if (updateError || !updatedEvent) {
		return [updateError ?? new Error('Event not found'), undefined];
	}
	return [undefined, updatedEvent as unknown as Event];
}
