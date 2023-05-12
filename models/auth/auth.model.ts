import { Roles } from '../user/role.model'

export type Auth = {
	token: string
	refresh_token: string
	user: {
		_id: string
		email: string
		name: string
		role: keyof typeof Roles
	}
}
