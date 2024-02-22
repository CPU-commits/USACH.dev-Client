// Zod
import { z } from 'zod'
// Types
import { FilesService } from './files.service'
import type { DefaultResponse, Fetch } from '~~/common/fetchModule'
import type { BlobFetch, BodyFetch } from '~~/models/body.model'
import type {
	Repository,
	SimpleRepository,
} from '~~/models/repository/repo.model'
import type { SystemFile } from '~~/models/repository/system_file.model'
import type { Like } from '~~/models/repository/like.model'

export class RepoSerivce {
	private readonly fetch: Fetch
	private readonly authStore = useAuthStore()
	private readonly router = useRouter()
	private readonly toastStore = useToastsStore()
	private filesService: FilesService

	constructor(fetchModule: Fetch, fileService: FilesService) {
		this.fetch = fetchModule
		this.filesService = fileService
	}

	async getRepo({
		username,
		repository,
	}: {
		username: string
		repository: string
	}) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ repository: Repository; like: Like | null }> &
				DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/repository/${username}/${repository}`,
			token: this.authStore.getToken,
		})

		return dataFetch.body
	}

	async getFolder({
		username,
		repository,
		idFolder,
	}: {
		username: string
		repository: string
		idFolder: string
	}) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ folder: SystemFile; repository: SimpleRepository }> &
				DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/repository/${username}/${repository}/${idFolder}`,
			token: this.authStore.getToken,
		})

		return dataFetch.body
	}

	async getRepos(page: number, search?: string, total = false) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{
				repositories: Array<Repository> | null
				total: number
			}> &
				DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/repository?page=${page}&total=${total}${
				search ? `&search=${search}` : ''
			}`,
			token: this.authStore.getToken,
		})

		return dataFetch.body
	}

	async getUserRepos(username: string) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ repositories: Array<Repository> | null }> &
				DefaultResponse
		>({
			method: 'get',
			URL: `/api/v1/repository/${username}`,
			token: this.authStore.getToken,
		})

		return dataFetch.body.repositories ?? []
	}

	async uploadRepository(repo: {
		name: string
		description: string
		access: string
	}) {
		try {
			const repoSchema = z.object({
				name: z
					.string()
					.min(1, {
						message: messages.required('Nombre repositorio'),
					})
					.max(100, {
						message: messages.max('Nombre repositorio', 100),
					})
					.regex(/^[0-9a-z_]+$/, {
						message: messages.format('Nombre repositorio'),
					}),
				description: z
					.string()
					.max(300, { message: messages.max('Descripción', 300) })
					.optional(),
				access: z.string(),
			})
			repoSchema.parse(repo)
			if (repo.access === '')
				throw new Error('Debe seleccionar un tipo de acceso')
			// Upload
			await this.fetch.fetchData({
				method: 'post',
				URL: '/api/v1/repository',
				token: this.authStore.getToken,
				body: {
					...repo,
					description:
						repo.description === '' ? undefined : repo.description,
				},
			})

			this.router.push(`/${this.authStore.getUsername}/${repo.name}`)
		} catch (err) {
			const error = this.fetch.handleError(err)

			this.toastStore.addToast({
				message: error.message,
				type: 'error',
			})
		}
	}

	async newElement(
		element: Omit<SystemFile, '_id'>,
		idRepo: string,
		file?: File | null,
		parent?: string,
	) {
		const form = new FormData()
		if (element.is_directory) form.append('name', element.name)
		else form.append('file', file ?? '')
		form.append('is_directory', String(element.is_directory))

		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ _id: string; file_type?: string; content?: string }> &
				DefaultResponse
		>({
			method: 'put',
			URL: `/api/v1/repository/element/${idRepo}${
				parent ? `?parent=${parent}` : ''
			}`,
			token: this.authStore.getToken,
			body: form,
		})

		return dataFetch.body
	}

	async deleteElement(idElement: string, idRepository: string) {
		await this.fetch.fetchData({
			method: 'delete',
			URL: `/api/v1/repository/${idRepository}/${idElement}`,
			token: this.authStore.getToken,
		})
	}

	async toggleLike(idRepository: string, isPlus: boolean) {
		await this.fetch.fetchData({
			method: 'post',
			URL: `/api/v1/repository/like/${idRepository}`,
			token: this.authStore.getToken,
			body: {
				plus: isPlus,
			},
		})
	}

	async updateRepository(
		idRepository: string,
		repository: {
			content?: string
			description?: string
			access?: string
			custom_access?: Array<string>
			tags?: Array<string>
		},
	) {
		await this.fetch.fetchData({
			method: 'put',
			URL: `/api/v1/repository/${idRepository}`,
			token: this.authStore.getToken,
			body: repository,
		})
	}

	async download(idRepository: string, idElement?: string) {
		const res = await this.fetch.fetchData<BlobFetch>({
			method: 'get',
			URL: `/api/v1/repository/download/${idRepository}${
				idElement ? `?child=${idElement}` : ''
			}`,
			token: this.authStore.getToken,
			responseType: 'blob',
		})

		this.filesService.downloadFileUrl(
			this.filesService.blobPartToUrl(
				res.file,
				res.headers.get('Content-Type') ?? '',
			),
			res.headers.get('Content-Disposition')?.split("'").at(1) ?? '',
		)
	}

	async addLink(
		idRepository: string,
		newLink: { type: string; link: string; title: string },
	) {
		const dataFetch = await this.fetch.fetchData<
			BodyFetch<{ id_link: string }> & DefaultResponse
		>({
			URL: `/api/v1/repository/link/${idRepository}`,
			method: 'put',
			body: newLink,
			token: this.authStore.getToken,
		})

		return dataFetch.body.id_link
	}

	async deleteLink(idLink: string, idRepository: string) {
		await this.fetch.fetchData({
			URL: `/api/v1/repository/${idRepository}/link/${idLink}`,
			method: 'delete',
			token: this.authStore.getToken,
		})
	}

	async deleteRepository(idRepository: string) {
		await this.fetch.fetchData({
			method: 'delete',
			URL: `/api/v1/repository/${idRepository}`,
			token: this.authStore.getToken,
		})
	}
}
