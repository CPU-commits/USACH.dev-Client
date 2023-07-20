import { Auth } from 'models/auth/auth.model'

export default defineNuxtRouteMiddleware(async (_to, from) => {
	if (useError().value) {
		return
	}
	if (process.client) {
		let isAuth = true
		if (!useAuthStore().isAuth) {
			const { session } = await useSession<{ auth?: Auth }>()
			if (session.value?.data?.auth) {
				useAuthStore().setAuth({
					token: session.value.data.auth.token,
					refresh_token: session.value.data.auth.refresh_token,
					user: session.value.data.auth.user,
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
