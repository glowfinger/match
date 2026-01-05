<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { Button } from '$lib/components/ui/button';

	const signInWithGoogle = async () => {
		await authClient.signIn.social({
			provider: 'google',
			callbackURL: '/',
		});
	};
</script>

<Button variant="outline" class="w-full" onclick={signInWithGoogle}>Sign in with Google</Button>
