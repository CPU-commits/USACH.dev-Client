export enum LinkType {
	'drive',
	'github',
	'cloud',
	'pdf',
	'youtube',
	'other',
}

export type LinkRepo = {
	_id: string
	type: keyof typeof LinkType
	title: string
	link: string
}
