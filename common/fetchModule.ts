/* eslint-disable no-console */
/* eslint-disable security-node/detect-crlf */
// Types
import type { FetchError } from 'ofetch'
import { ZodError } from 'zod'
// Modules
import { capitalizeFirstLetter } from '@/utils/format'

enum HTTPMethods {
	'post',
	'put',
	'get',
	'delete',
	'patch',
}

interface ConfigFetch {
	method: keyof typeof HTTPMethods
	URL: string

	body?: BodyInit | null | undefined | Record<string, any>
	spinnerStatus?: boolean
	headers?: HeadersInit
	token?: string | null
	nuxt?: boolean
	// Abort is for all same URLs
	abort?: {
		url: string
	}
	signal?: AbortSignal
	responseType?: 'blob' | 'text' | 'json' | 'stream' | 'arrayBuffer'
}

export type DefaultResponse = {
	message?: string
}

export type ErrorFetch = {
	message: string
	statusCode: number
}

export const ERROR_ABORT = 'The user aborted a request. ()'

export class Fetch {
	private publicApi: string | undefined
	// string: URL, Array: currentFetchController
	private currentFetch: Map<
		string,
		Array<{
			id: string
			controller: AbortController
		}>
	> = new Map()

	private counters: {
		counterFetch: number
		counterGetFetch: number
	} = new Proxy(
		{ counterFetch: 0, counterGetFetch: 0 },
		{
			set(obj, prop, value) {
				if (prop === 'counterFetch' || prop === 'counterGetFetch') {
					obj[prop] = value

					if (prop === 'counterFetch' && value === 0)
						useSpinner().value = false
					if (prop === 'counterGetFetch' && value === 0)
						useSpinnerGet().value = false
				}
				return true
			},
		},
	)

	private readonly spinner = useSpinner()
	private readonly spinnerGet = useSpinnerGet()

	private generateFetchId(): string {
		return `fetch_id_${crypto.randomUUID()}`
	}

	private isFetchError(error: unknown): error is FetchError {
		return typeof error === 'object' && error !== null && 'message' in error
	}

	handleError(error: unknown): ErrorFetch {
		// Clear errors
		useFieldErrors().value.clear()
		if (error instanceof ZodError) {
			const message = 'Error en el formulario'
			// Iterate
			for (const iss of error.issues) {
				useFieldErrors().value.set(iss.path[0] as string, iss.message)
			}

			return {
				message: capitalizeFirstLetter(message),
				statusCode: 400,
			}
		} else if (this.isFetchError(error)) {
			const message = error.data?.message ?? error.message
			return {
				message: capitalizeFirstLetter(message),
				statusCode: error.response?.status ?? 500,
			}
		} else if (error instanceof Error) {
			return {
				message: capitalizeFirstLetter(error.message),
				statusCode: 500,
			}
		}
		return {
			message: 'Error inesperado',
			statusCode: 500,
		}
	}

	private getFetch({
		method,
		body,
		nuxt,
		token,
		responseType,
		signal,
	}: ConfigFetch) {
		if (!this.publicApi) {
			const config = useRuntimeConfig()
			this.publicApi = config.public.API
		}
		return $fetch.create({
			baseURL: !nuxt ? this.publicApi : undefined,
			parseResponse: responseType === 'blob' ? undefined : JSON.parse,
			responseType,
			headers: {
				Authorization: `Bearer ${token}` ?? '',
			},
			method,
			body,
			signal,
			onRequestError({ request, error }) {
				// Log error
				console.log(`[fetch request error] ${request} ${error}`)
			},
			onResponseError({ request, response }) {
				// Log response
				console.log('[fetch response error]', request, response.body)
			},
			onResponse({ response }) {
				if (response._data instanceof Blob) {
					response._data = {
						file: response._data,
						headers: response.headers,
					}
				}
			},
			mode: 'cors',
		})
	}

	private popFetch(
		id: string,
		counters: { get: boolean; fetch: boolean },
		key: string,
	) {
		if (counters.get) this.counters.counterGetFetch -= 1
		if (counters.fetch) this.counters.counterFetch -= 1

		const index = this.currentFetch.get(key)?.findIndex((f) => f.id === id)
		this.currentFetch.get(key)?.splice(index ?? 0, 1)
	}

	async fetchData<T = DefaultResponse>(config: ConfigFetch): Promise<T> {
		const key = config.URL.split('?')[0]
		// Abort all fetchs
		const abortKey = config.abort?.url === 'same' ? key : config.abort?.url
		if (config.abort && this.currentFetch.has(abortKey ?? '')) {
			const struct = this.currentFetch.get(abortKey ?? '')
			struct?.forEach((c) => {
				c.controller.abort()
			})
			struct?.splice(0, struct.length)
		}
		// Id
		const id = this.generateFetchId()
		// Controller signal
		const controller = new AbortController()
		config.signal = controller.signal

		if (this.currentFetch.has(key)) {
			this.currentFetch.get(key)?.push({
				id,
				controller,
			})
		} else {
			this.currentFetch.set(key, [{ id, controller }])
		}
		// Create fetch
		const apiFetch = this.getFetch(config)

		if (config.method !== 'get' || config.spinnerStatus) {
			this.spinner.value = true
			this.counters.counterFetch += 1
		}
		if (config.method === 'get') {
			this.spinnerGet.value = true
			this.counters.counterGetFetch += 1
		}

		const dataFetch = await apiFetch<T & DefaultResponse>(config.URL).catch(
			(err) => {
				this.popFetch(
					id,
					{
						get: config.method === 'get',
						fetch:
							config.method !== 'get' ||
							(config.spinnerStatus ?? false),
					},
					key,
				)
				throw err
			},
		)
		this.popFetch(
			id,
			{
				get: config.method === 'get',
				fetch:
					config.method !== 'get' || (config.spinnerStatus ?? false),
			},
			key,
		)
		return dataFetch as T & DefaultResponse
	}
}
