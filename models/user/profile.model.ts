import { UserMedia } from './user.model'

export type Profile = {
	description?: string
	avatar?: string
	followers?: number
	following?: number
	date: string
	media?: UserMedia
}
