import { z } from 'zod'
import { DefaultResponse, Fetch } from '~~/common/fetchModule'
import { BodyFetch } from '~~/models/body.model'
import { Discussion } from '~~/models/dicussion/discussion'

export class DiscussionService {
	private readonly fetch: Fetch
	private readonly authStore = useAuthStore()

	constructor(fetch: Fetch) {
		this.fetch = fetch
	}

	async getDiscussion(idDiscussion: string) {
		const discussion = await this.fetch.fetchData<
			BodyFetch<{ discussion: Discussion }> & DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/discussion/${idDiscussion}`,
			token: this.authStore.getToken,
		})

		return discussion.body.discussion
	}

	async getDiscussions(getters: {
		page: number
		orderBy: string
		repository?: string
		count?: boolean
		search?: string
	}) {
		const fetchData = await this.fetch.fetchData<
			BodyFetch<{
				discussions: Array<Omit<Discussion, 'text'>> | null
				total: number
			}> &
				DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/discussion?page=${getters.page}&orderBy=${
				getters.orderBy
			}${
				getters.repository ? `&repository=${getters.repository}` : ''
			}&count=${getters.count}${
				getters.search ? `&search=${getters.search}` : ''
			}`,
			token: this.authStore.getToken,
		})

		return {
			discussions: fetchData.body.discussions ?? [],
			total: fetchData.body.total,
		}
	}

	async uploadDiscussion(discussion: {
		title: string
		file: File | null
		text: string
		repository: string
		snippet: string
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
			snippet: z
				.string()
				.min(1, { message: 'El fragmento es requerido' })
				.max(300, {
					message: 'El fragmento debe tener máximo 100 cáracteres',
				}),
		})
		schema.parse(discussion)
		// Upload
		const form = new FormData()
		form.append('title', discussion.title)
		form.append('text', discussion.text)
		form.append('snippet', discussion.snippet)
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

	async react(idDiscussion: string, reaction: string) {
		await this.fetch.fetchData({
			method: 'post',
			URL: `/api/v1/discussion/reaction/${idDiscussion}`,
			token: this.authStore.getToken,
			body: {
				reaction,
			},
		})
	}

	async deleteReaction(idDiscussion: string) {
		await this.fetch.fetchData({
			method: 'delete',
			URL: `/api/v1/discussion/reaction/${idDiscussion}`,
			token: this.authStore.getToken,
		})
	}
}
