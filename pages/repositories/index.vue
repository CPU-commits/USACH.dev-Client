<script lang="ts" setup>
import type { Repository } from '~~/models/repository/repo.model'

// Nuxtapp
const { $repoService } = useNuxtApp()
// Router
const route = useRoute()
const router = useRouter()

// Form
const search = ref((route.query?.search as string) ?? '')
const total = ref(0)

provide('total', total)
// Data
const repositories = ref<Array<Repository> | null>(null)

onMounted(() => searchRepos(0, true))

async function searchRepos(page: number, returnAll = false) {
	// Search data
	if (search.value !== '') router.push(`?search=${search.value}`)
	const dataFetch = await $repoService.getRepos(page, search.value, returnAll)
	if (dataFetch.total) total.value = dataFetch.total

	repositories.value = dataFetch.repositories ?? []
}
</script>

<template>
	<HTMLContainer orientation="V" :gap="10">
		<header class="Search">
			<HTMLSearch
				v-model:value="search"
				:search="() => searchRepos(0, true)"
				placeholder="Busquemos un repositorio"
			/>
		</header>
		<section class="Repositories">
			<RepoCard
				v-for="repository in repositories"
				:key="repository._id"
				:repository="repository"
				:owner="repository.owner.username"
			/>
			<HTMLNav
				:navigate="{
					activate: true,
					fn: searchRepos,
					max: 20,
				}"
			/>
		</section>
	</HTMLContainer>
</template>

<style>
.Repositories {
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	gap: 15px;
	background-color: var(--color-console);
	padding: 15px;
	border-radius: 8px;
}

@media (max-width: 575.98px) {
	.Repositories {
		padding: 0;
		background-color: transparent;
	}

	.Repositories button:disabled i {
		color: var(--color-console) !important;
	}
}
</style>
