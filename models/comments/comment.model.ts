import type { User } from '@/models/user/user.model'

export type Comment = {
	_id: string
	author: User
	discussion?: string
	responses?: Array<Comment> | null
	comment: string
	created_at: string
	updated_at: string
}
