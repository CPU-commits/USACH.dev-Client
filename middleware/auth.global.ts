export default defineNuxtRouteMiddleware(async (_to, from) => {
	if (useError().value) {
		return
	}
	if (process.client) {
		let isAuth = true
		if (!useAuthStore().isAuth) {
			const { session } = await useSession()
			if (session.value?.auth) {
				useAuthStore().setAuth({
					token: session.value.auth.token,
					refresh_token: session.value.auth.refresh_token,
					user: session.value.auth.user,
				})
			} else isAuth = false
		}
		const auth = _to.meta?.auth ?? false
		if (auth && !isAuth)
			return navigateTo({
				path: '/session',
				query: {
					redirect: from.path,
				},
			})
	}
})
