import { Profile } from './profile.model'
import { Roles } from './role.model'

export type UserMedia = {
	instagran: string
	github: string
	twitter: string
}

export type User = {
	full_name: string
	username: string
	role: keyof typeof Roles
	profile?: Profile
	date: string
}

export type SimpleUser = {
	_id: string
	full_name: string
	username: string
}
