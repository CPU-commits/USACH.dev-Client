// @ts-ignore
import eslint from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			API: 'http://localhost:8080',
			WS: 'ws://localhost:5000',
		},
		cookies: {
			CRYPTO_KEY: 'E(H+MbQeThWmZq3t6w9z$C&F)J@NcRfU',
			EXPIRY_IN_SECONDS: 3600,
		},
		redis: {
			user: '',
			host: '',
			port: 0,
			password: '',
		},
	},
	typescript: {
		strict: true,
		typeCheck: true,
	},
	css: ['@/assets/scss/main.scss'],
	modules: ['@nuxt/image-edge', '@pinia/nuxt', 'nuxt-security'],
	imports: {
		dirs: ['stores'],
	},
	vite: {
		css: {
			preprocessorOptions: {
				scss: {
					additionalData:
						'@use "@/assets/scss/_variables.scss" as *;',
				},
			},
		},
		plugins: [eslint()],
	},
	nitro: {
		storage: {
			db: {
				driver: 'fs',
				base: './data/db',
			},
		},
	},
})
