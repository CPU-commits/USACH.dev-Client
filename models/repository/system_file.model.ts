export type SystemFile = {
	_id: string
	file_type?: string
	name: string
	childrens?: Array<SystemFile>
	content?: string
	is_directory: boolean
	date: string
}
