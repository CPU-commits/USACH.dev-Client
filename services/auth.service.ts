// Zod
import { z } from 'zod'
// Types
import type { DefaultResponse, Fetch } from '~~/common/fetchModule'
import type { Auth } from '~~/models/auth/auth.model'
import type { BodyFetch } from '~~/models/body.model'

export class AuthService {
	private readonly fetch: Fetch
	private readonly router = useRouter()
	private readonly toastStore = useToastsStore()

	constructor(fetchModule: Fetch) {
		this.fetch = fetchModule
	}

	async register(form: {
		full_name: string
		confirm_password: string
		password: string
		email: string
	}) {
		try {
			// Schema data
			const formSchema = z.object({
				full_name: z
					.string()
					.min(1, { message: messages.required('Nombre completo') })
					.max(100, {
						message: messages.max('Nombre completo', 100),
					}),
				confirm_password: z
					.string()
					.min(6, {
						message: messages.min('Confirmar contraseña', 6),
					})
					.max(100, {
						message: messages.max('Confirmar contraseña', 100),
					}),
				password: z
					.string()
					.min(6, { message: messages.min('Contraseña', 6) })
					.max(100, {
						message: messages.max('Contraseña', 100),
					}),
				email: z
					.string()
					.min(1, { message: messages.required('Email') })
					.max(100, { message: messages.max('Email', 100) })
					.email({ message: messages.email('Email') }),
			})
			formSchema.parse(form)
			if (form.confirm_password !== form.password)
				throw new Error('Las contraseñas deben ser iguales')
			// Register
			await this.fetch.fetchData({
				URL: '/api/v1/auth',
				method: 'post',
				body: {
					email: form.email,
					password: form.password,
					full_name: form.full_name,
				},
			})

			this.toastStore.addToast({
				message:
					'El registro a sido exitoso. Revisa tu correo para confirmar tu cuenta',
				type: 'success',
			})
			this.router.push('/')
		} catch (err) {
			const error = this.fetch.handleError(err)
			this.toastStore.addToast({
				message: error.message,
				type: 'error',
			})
		}
	}

	async login(form: { email: string; password: string }) {
		const auth = await this.fetch.fetchData<
			BodyFetch<Auth> & DefaultResponse
		>({
			method: 'post',
			URL: '/api/v1/auth/login',
			body: form,
		})
		return auth.body
	}
}
