import { z } from 'zod'
import { Fetch } from '~~/common/fetchModule'

export class DiscussionService {
	private readonly fetch: Fetch
	private readonly authStore = useAuthStore()

	constructor(fetch: Fetch) {
		this.fetch = fetch
	}

	async uploadDiscussion(discussion: {
		title: string
		file: File | null
		text: string
		repository: string
	}) {
		// Validate data
		const schema = z.object({
			title: z
				.string()
				.min(1, { message: 'El titulo es requerido' })
				.max(100, {
					message: 'El titulo debe tener máximo 100 cáracteres',
				}),
			text: z.string().min(1, { message: 'El cuerpo es requerido' }),
		})
		schema.parse(discussion)
		// Upload
		const form = new FormData()
		form.append('title', discussion.title)
		form.append('text', discussion.text)
		if (discussion.file) form.append('image', discussion.file)
		if (discussion.repository !== '')
			form.append('repository', discussion.repository)

		await this.fetch.fetchData({
			method: 'post',
			URL: '/api/v1/discussion',
			token: this.authStore.getToken,
			body: form,
		})
	}
}
