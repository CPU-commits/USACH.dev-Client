export type Discussion = {
	_id: string
	title: string
	image?: string
	repository?: string
	text: string
	snippet: string
	tags?: Array<string>
	code: string
	created_at: string
	updated_at: string
	reactions?: Array<{
		count: number
		reaction: string
	}>
	user_reaction?: {
		reaction: string
	}
}
