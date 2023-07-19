<script lang="ts" setup>
import { Editor } from '@tiptap/core'
import { Repository } from '~~/models/repository/repo.model'

definePageMeta({
	auth: true,
})
// NuxtApp
const { $repoService, $fetchModule, $discussionService } = useNuxtApp()
// Stores
const authStore = useAuthStore()
const tostsStore = useToastsStore()
// Router
const router = useRouter()

// Form
const discussion = ref({
	title: 'Nueva discución',
	file: null as File | null,
	text: '',
	repository: '',
	image: '/img/img.svg',
	snippet: '',
})
const inputFile = ref<HTMLInputElement | null>(null)
const editor = ref<Editor | null>(null)

function loadImage() {
	const files = inputFile.value?.files
	if (files && files.length > 0) {
		const file = files[0]
		try {
			if (!file.type.includes('image'))
				throw new Error('El archivo debe ser una imagen')
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => {
				discussion.value.image = reader.result as string
			}
			// Load file
			discussion.value.file = file
		} catch (err) {
			const error = $fetchModule.handleError(err)
			tostsStore.addToast({
				message: error.message,
				type: 'error',
			})
		}
	}
}
// Data
const repositories = ref<Array<Repository> | null>(null)

onMounted(async () => {
	const repos = await $repoService.getUserRepos(authStore.getUsername ?? '')
	repositories.value = repos
})

async function uploadDiscussion() {
	try {
		discussion.value.text = editor.value?.getHTML() ?? ''
		await $discussionService.uploadDiscussion(discussion.value)

		// Router
		let toPush = ''
		if (discussion.value.repository !== '')
			toPush = `/${authStore.getUsername}/${(() =>
				repositories.value?.find(
					(r) => r._id === discussion.value.repository,
				)?.name)()}/discussions`
		else toPush = '/discussions'
		router.push(toPush)
	} catch (err) {
		const error = $fetchModule.handleError(err)
		tostsStore.addToast({
			message: error.message,
			type: 'error',
		})
	}
}
</script>

<template>
	<HTMLContainer orientation="V" :gap="20">
		<HTMLForm :action="uploadDiscussion">
			<input
				v-model="discussion.title"
				type="text"
				placeholder="Titulo"
			/>
			<span>Imagen (Opcional)</span>
			<div class="Image">
				<img
					:src="discussion.image"
					alt="Nueva imagen"
					@click="() => inputFile?.click()"
				/>
				<input ref="inputFile" type="file" @change="loadImage" />
			</div>
			<HTMLSelect
				v-model:value="discussion.repository"
				label-text="Repositorio"
			>
				<option value="">Sin repositorio ligado</option>
				<option
					v-for="repository in repositories"
					:key="repository._id"
					:value="repository._id"
				>
					{{ capitalizeFirstLetter(repository.name) }}
					&lt;{{ repository.stars }} Estrellas>
				</option>
			</HTMLSelect>
			<HTMLInput
				v-model:value="discussion.snippet"
				label-text="Fragmento"
				placeholder="¿De qué va a tratar?..."
			/>
			<HTMLRich @build-editor="(e) => (editor = e)" />
			<HTMLButton type="submit"> Subir discuci&oacute;n </HTMLButton>
		</HTMLForm>
	</HTMLContainer>
</template>

<style lang="scss" scoped>
input {
	background-color: transparent;
	border: none;
	font-size: 2rem;
	text-align: center;
}

input[type='file'] {
	display: none;
}

img {
	width: 100%;
	object-fit: cover;
	max-height: 300px;
	border-radius: 10px;
}
</style>
