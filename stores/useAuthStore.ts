import { defineStore } from 'pinia'
import { Auth } from '~~/models/auth/auth.model'
import { Roles } from '~~/models/user/role.model'

type KeysUserTypes = keyof typeof Roles

async function logOut() {
	const { remove } = await useSession()
	await remove()
}

const useAuthStore = defineStore('auth', {
	state: () => ({
		isAuth: false,
		user: null as Auth | null,
	}),
	getters: {
		getIsAuth(state) {
			return state.isAuth
		},
		getUser(state): Auth | null {
			return state.user
		},
		getToken(state): string | null {
			return state.user?.token ?? null
		},
		getUserType(state): KeysUserTypes | null {
			return state.user?.user.role ?? null
		},
		getName(state): string | null {
			return state.user?.user.name ?? null
		},
		getID(state): string | null {
			return state.user?.user._id ?? null
		},
		getUsername(state): string | null {
			const email = state.user?.user.email
			return email ? email.replace('@usach.cl', '') : null
		},
	},
	actions: {
		unsetAuth() {
			this.isAuth = false
			this.user = null
		},
		async logIn(userForm: { email: string; password: string }) {
			const toastStore = useToastsStore()
			try {
				const { $authService } = useNuxtApp()
				const dataFetch = await $authService.login(userForm)

				this.setAuth(dataFetch)
				await this.setSession(dataFetch)
				// Redirect
				const router = useRouter()
				router.push(this.getUsername ?? '/')
				toastStore.addToast({
					message: 'Has iniciado sesión exitosamente',
					type: 'success',
				})
			} catch (err) {
				toastStore.addToast({
					message: 'Credenciales inválidas',
					type: 'error',
				})
			}
		},
		async logOut() {
			await logOut()
			this.unsetAuth()
		},
		setAuth(user: Auth) {
			this.isAuth = true
			this.user = user
		},
		async setSession(auth: Auth) {
			const { refresh, overwrite } = await useSession()
			await refresh()
			await overwrite({
				auth,
			})
		},
		userTypeNotIs(...userTypes: KeysUserTypes[]) {
			return !userTypes.includes(this.getUserType as never)
		},
		userTypeIs(...userTypes: KeysUserTypes[]) {
			return userTypes.includes(this.getUserType as never)
		},
	},
})

export default useAuthStore
