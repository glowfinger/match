import type { LayoutServerLoad } from './$types';

export const csr = true;
export const ssr = false;

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session,
	};
};
