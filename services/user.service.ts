// Types
import type { DefaultResponse, Fetch } from '~~/common/fetchModule'
import { BodyFetch } from '~~/models/body.model'
import { User } from '~~/models/user/user.model'

export class UserService {
	private readonly fetch: Fetch
	private readonly authStore = useAuthStore()
	private readonly toastStore = useToastsStore()

	constructor(fetchModule: Fetch) {
		this.fetch = fetchModule
	}

	async getUser(username: string, profile = false) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ user: User }> & DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/user/${username}?profile=${profile}`,
		})

		return dataFetch.body.user
	}

	getAvatar(username: string) {
		const {
			public: { API },
		} = useRuntimeConfig()
		return `${API}/api/v1/user/avatar/${username}`
	}

	async updateProfile(profile: { description?: string; avatar?: File }) {
		try {
			const form = new FormData()
			if (profile.description)
				form.append('description', profile.description)
			if (profile.avatar) form.append('avatar', profile.avatar)

			await this.fetch.fetchData({
				method: 'put',
				URL: `/api/v1/user/profile`,
				body: form,
				token: this.authStore.getToken,
			})
		} catch (err) {
			this.toastStore.addToast({
				message: this.fetch.handleError(err).message,
				type: 'error',
			})
		}
	}
}
