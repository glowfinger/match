import { env } from '$env/dynamic/public';

const CONFIG = {
	EVENT_ENABLED: env.PUBLIC_FEATURE_EVENT_ENABLED === 'true' ? true : false,
} as const;

export default CONFIG;
