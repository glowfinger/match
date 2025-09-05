export interface Event {
	uuid: string;
	createdAt: string;
	userAgent: string;
	template: string;
	details?: EventDetails;
	post?: EventPost;
}

export interface EventDetails {
	headline: string;
	body: string;
	cta: string;
	footnote: string;
	highlights: string;
}

export interface EventPost {
	body: string;
	tags: string;
}

export interface EventImage {
	id: number;
	eventUuid: string;
	createdAt: string;
	type: string;
	height: number;
	width: number;
	base64: string;
}
