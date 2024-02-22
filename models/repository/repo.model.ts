import type { SimpleUser } from '../user/user.model'
import type { LinkRepo } from './link.model'
import type { SystemFile } from './system_file.model'

export enum RepositoryAccess {
	'public',
	'private',
	'private-group',
}

export type SimpleRepository = {
	_id: string
	name: string
	owner: SimpleUser
}

export type Repository = {
	content?: string
	tags: Array<string> | null
	stars: number
	system_file?: Array<SystemFile>
	links?: Array<LinkRepo>
	description?: string
	access: keyof typeof RepositoryAccess
	views: number
	downloads: number
	updated_date: string
	created_date: string
} & SimpleRepository
