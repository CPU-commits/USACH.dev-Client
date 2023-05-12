<script lang="ts" setup>
// Types
import type { SystemFile } from '~~/models/repository/system_file.model'

const props = defineProps<{
	systemFile: Array<SystemFile>
	idRepository: string
	folder?: string
	isOwner: boolean
	repoName: string
}>()
// Nuxt App
const { $repoService, $fetchModule } = useNuxtApp()
// Stores
const toastsStore = useToastsStore()

// Emits
const emits = defineEmits<{
	(e: 'newElement', el: SystemFile): void
	(e: 'deleteElement', el: string): void
}>()

// Folder
const creatingFolder = ref(false)

function addFolder() {
	creatingFolder.value = true
}

async function createFolder(folderName: string) {
	creatingFolder.value = false
	// Create folder
	if (folderName.trim() !== '') {
		const element = {
			name: folderName,
			is_directory: true,
		} as SystemFile
		try {
			const result = await $repoService.newElement(
				element,
				props.idRepository,
				null,
				props.folder,
			)

			emits('newElement', {
				_id: result._id,
				date: new Date().toISOString(),
				name: folderName,
				is_directory: true,
			})
		} catch (err) {
			const error = $fetchModule.handleError(err)
			toastsStore.addToast({
				message: error.message,
				type: 'error',
			})
		}
	}
}

// Files
const inputEl = ref<HTMLInputElement | null>(null)

async function addFile() {
	const files = inputEl.value?.files
	if ((files?.length ?? 0) > 1)
		toastsStore.addToast({
			message: 'Debe seleccionar máx. 1 archivo',
			type: 'error',
		})
	else if (files && (files?.length ?? 0) > 0) {
		const element = {
			is_directory: false,
		} as SystemFile

		const file = files[0]
		const result = await $repoService.newElement(
			element,
			props.idRepository,
			file,
			props.folder,
		)
		emits('newElement', {
			_id: result._id,
			content: '',
			file_type: '',
			date: new Date().toISOString(),
			is_directory: false,
			name: file.name,
		})
	}
}

async function deleteElement(idElement: string) {
	try {
		await $repoService.deleteElement(idElement, props.idRepository)
		emits('deleteElement', idElement)
	} catch (err) {
		const error = $fetchModule.handleError(err)
		toastsStore.addToast({
			message: error.message,
			type: 'error',
		})
	}
}

async function downloadElement(idElement: string) {
	try {
		await $repoService.download(props.idRepository, idElement)
	} catch (err) {
		toastsStore.addToast({
			message: 'No se ha podido descargar el archivo',
			type: 'error',
		})
	}
}
</script>

<template>
	<section class="SystemFile">
		<RepoFolder
			v-if="creatingFolder"
			@folder-name="(folderName) => createFolder(folderName)"
		/>
		<RepoElement
			v-for="el in systemFile"
			:key="el._id"
			:element="el"
			:is-owner="isOwner"
			:repo-name="repoName"
			@delete="(idElement) => deleteElement(idElement)"
			@download="(idElement) => downloadElement(idElement)"
		/>
		<span v-if="systemFile.length === 0">
			<i class="fa-solid fa-box-open"></i> Sin archivos...
		</span>
		<article v-if="isOwner" class="SystemFile__new">
			<HTMLSimpleButton :click="addFolder">
				<i class="fa-solid fa-folder-plus"></i>
			</HTMLSimpleButton>
			<HTMLSimpleButton :click="() => inputEl?.click()">
				<i class="fa-solid fa-file-circle-plus"></i>
			</HTMLSimpleButton>
			<!-- Invisible file input -->
			<input ref="inputEl" type="file" @change="addFile" />
		</article>
	</section>
</template>

<style scoped>
.SystemFile {
	background-color: var(--color-console);
	border-radius: 5px;
	width: 100%;
	display: flex;
	padding: 10px;
	box-sizing: border-box;
	flex-direction: column;
	position: relative;
	padding-bottom: 35px;
}

.SystemFile__new {
	background-color: var(--color-main);
	width: 100%;
	display: flex;
	position: absolute;
	left: 0;
	justify-content: center;
	gap: 30px;
	box-sizing: border-box;
	padding: 5px;
	bottom: 0;
	border-bottom-right-radius: 5px;
	border-bottom-left-radius: 5px;
}

input {
	display: none;
}

i {
	color: var(--color-bg);
	font-size: 0.9rem;
	transition: all 0.4s ease;
}

i:hover {
	color: white;
}
</style>
