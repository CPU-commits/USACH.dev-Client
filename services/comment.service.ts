import { DefaultResponse, Fetch } from 'common/fetchModule'
import { BodyFetch } from 'models/body.model'
import { Comment } from 'models/comments/comment.model'

export class CommentService {
	private readonly fetch: Fetch
	private readonly authStore = useAuthStore()
	private readonly toastsStore = useToastsStore()

	constructor(fetch: Fetch) {
		this.fetch = fetch
	}

	async getComments(idDiscussion: string) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ comments: Array<Comment> | null }> & DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/comments/discussion/${idDiscussion}`,
			token: this.authStore.getToken,
		})

		return dataFetch.body.comments
	}

	async comment(
		comment: { comment: string },
		idDiscussion: string,
		reply = { isReply: false } as { isReply: boolean; idComment: string },
	) {
		try {
			if (comment.comment === '')
				throw new Error('Debes escribir un comentario')
			let URL = `/api/v1/comments/${idDiscussion}`
			if (reply.isReply) URL += `?reply=${reply.idComment}`

			const dataFetch = await this.fetch.fetchData<
				BodyFetch<{ inserted_id: string }> & DefaultResponse
			>({
				method: 'post',
				URL,
				body: comment,
				token: this.authStore.getToken,
			})
			return dataFetch.body.inserted_id
		} catch (err) {
			this.toastsStore.addToast({
				message: this.fetch.handleError(err).message,
				type: 'error',
			})
			return null
		}
	}
}
