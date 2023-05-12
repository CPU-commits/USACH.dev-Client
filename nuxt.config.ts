import eslint from 'vite-plugin-eslint'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	runtimeConfig: {
		public: {
			API: 'http://localhost:8080',
		},
	},
	typescript: {
		strict: true,
		typeCheck: true,
	},
	css: ['@/assets/scss/main.scss'],
	modules: [
		'@nuxt/image-edge',
		'@pinia/nuxt',
		'nuxt-security',
		'@sidebase/nuxt-session',
	],
	session: {
		session: {
			expiryInSeconds: 60 * 60 * 8,
		},
	},
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
	security: {
		rateLimiter: {
			value: {
				tokensPerInterval: 150,
				interval: 'hour',
				fireImmediately: false,
			},
			route: '/**',
		},
		headers: {
			contentSecurityPolicy: {
				// img-src * 'self' data: https:
				value: "base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src * 'self' data: https:;object-src 'none';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests",
				route: '/**',
			},
			crossOriginEmbedderPolicy: {
				value: 'unsafe-none',
				route: '/**',
			},
		},
		allowedMethodsRestricter: {
			value: ['GET', 'POST'],
			route: '/**',
		},
	},
})
