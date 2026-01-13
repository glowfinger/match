import { PRIVATE_ALLOWED_EMAILS } from '$env/static/private';
import { json } from '@sveltejs/kit';
export async function POST({ request }) {
	const { email } = await request.json();

	const allowedEmails = PRIVATE_ALLOWED_EMAILS.split(',').map((email) =>
		email.trim().toLowerCase(),
	);
	if (allowedEmails.includes(email.toLowerCase().trim())) {
		return json({ allowed: true }, { status: 200 });
	}
	return json({ allowed: false }, { status: 401 });
}
