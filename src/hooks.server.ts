import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

const SIGN_IN_ROUTE = '/sign-in';
const ALLOWED_EMAILS = ['dtdiii.lilley@gmail.com'];
const HOME_ROUTE = '/';
const API_AUTH_ROUTE = '/api/auth';
const PUBLIC_ROUTES = [SIGN_IN_ROUTE, '/not-permitted'];

export async function handle({ event, resolve }) {
	if (event.url.pathname.startsWith(API_AUTH_ROUTE)) {
		return svelteKitHandler({ event, resolve, auth, building });
	}

	const session = await auth.api.getSession({
		headers: event.request.headers,
	});

	// if (session) {
	// 	event.locals.session = session.session;
	// 	event.locals.user = session.user;
	// }

	if (session === null && !PUBLIC_ROUTES.includes(event.url.pathname)) {
		throw redirect(302, SIGN_IN_ROUTE);
	}

	if (session !== null && PUBLIC_ROUTES.includes(event.url.pathname)) {
		throw redirect(302, HOME_ROUTE);
	}

	return svelteKitHandler({ event, resolve, auth, building });
}
