import type { EventImage } from '$lib/types/Event';
import { db } from '../IndexedDB';

export async function getImagesByEvent(eventUuid: string): Promise<EventImage[]> {
	return db.eventsImages.where({ eventUuid }).toArray();
}

export async function setEventImage(image: EventImage | Omit<EventImage, 'id'>): Promise<void> {
	const criteria = { eventUuid: image.eventUuid, type: image.type };
	const existing = await db.eventsImages.where(criteria).first();
	if (existing) {
		await db.eventsImages.update(existing.id, image);
	} else {
		await db.eventsImages.add(image);
	}
}

export async function deleteImagesByEvent(eventUuid: string): Promise<void> {
	await db.eventsImages.where({ eventUuid }).delete();
}

export async function deleteImagesByEventAndType(eventUuid: string, type: string): Promise<void> {
	await db.eventsImages.where({ eventUuid, type }).delete();
}
