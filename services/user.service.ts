// Types
import type { DefaultResponse, Fetch } from '~~/common/fetchModule'
import { BodyFetch } from '~~/models/body.model'
import { User } from '~~/models/user/user.model'

export class UserService {
	private readonly fetch: Fetch
	private readonly router = useRouter()
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
}
