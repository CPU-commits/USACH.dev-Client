<script lang="ts" setup>
import { SimpleRepository } from '~~/models/repository/repo.model'
import { SystemFile } from '~~/models/repository/system_file.model'

// Nuxt app
const { $repoService } = useNuxtApp()
// Stores
const authStore = useAuthStore()
const toastsStore = useToastsStore()
// Route
const route = useRoute()

const username = route.params.user
const repoName = route.params.repo
const idFolder = route.params.folder

// Data
const folder = ref<null | SystemFile>(null)
const repository = ref<null | SimpleRepository>(null)
const isOwner = ref(false)

onMounted(async () => {
	const dataFetch = await $repoService.getFolder({
		username: username as string,
		repository: repoName as string,
		idFolder: idFolder as string,
	})

	folder.value = dataFetch.folder
	repository.value = dataFetch.repository

	// Set isOwner
	isOwner.value = authStore.getUsername === repository.value?.owner.username
})

async function downloadFolder() {
	try {
		await $repoService.download(
			repository.value?._id ?? '',
			folder.value?._id,
		)
	} catch (err) {
		toastsStore.addToast({
			message: 'No se ha podido descargar el archivo',
			type: 'error',
		})
	}
}
</script>

<template>
	<HTMLContainer orientation="V" :gap="10">
		<RepoNav
			v-if="repository"
			:is-owner="isOwner"
			:repo-name="repository?.name ?? ''"
			:owner="repository?.owner.username ?? ''"
		/>
		<section v-if="repository && folder" class="Repository__body--content">
			<h2>
				<NuxtLink
					:to="`/${repository.owner.username}/${repository.name}`"
				>
					{{ repository.name }} -
				</NuxtLink>
				<NuxtLink :to="`/${repository.owner.username}`">
					{{ repository.owner.full_name }} &lt;{{
						repository.owner.username
					}}>
				</NuxtLink>
				> {{ folder.name }}
			</h2>
			<header>
				<HTMLButton type="button" :click="downloadFolder">
					<i class="fa-solid fa-download" />
					Descargar carpeta
				</HTMLButton>
			</header>
			<RepoSystemFile
				:is-owner="isOwner"
				:id-repository="repository._id"
				:repo-name="repository.name"
				:folder="folder._id"
				:system-file="folder?.childrens ?? []"
				@new-element="
					(el) =>
						folder?.childrens
							? folder?.childrens?.push(el)
							: (folder as SystemFile).childrens = [el]
				"
				@delete-element="
					(idEl) => {
						if (folder?.childrens)
							folder.childrens = folder?.childrens?.filter(
								(el) => el._id !== idEl,
							)
					}
				"
			/>
		</section>
	</HTMLContainer>
</template>

<style scoped>
.Repository__body--content {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

a {
	text-decoration: none;
	color: var(--color-main);
}

button i {
	color: var(--color-bg);
}
</style>
