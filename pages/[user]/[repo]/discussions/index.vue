<script lang="ts" setup>
// Types
import type { Repository } from '~~/models/repository/repo.model'
import type { Discussion } from '~~/models/dicussion/discussion'

// Nuxt app
const { $repoService, $discussionService } = useNuxtApp()
// Stores
const authStore = useAuthStore()
// Route
const route = useRoute()

const username = route.params.user
const repoName = route.params.repo

// Data
const repository = ref<null | Repository>(null)
const discussions = ref<null | Array<Omit<Discussion, 'text'>>>(null)
const page = ref(0)
const isOwner = ref(false)

onMounted(async () => {
	const dataFetch = await $repoService
		.getRepo({
			username: username as string,
			repository: repoName as string,
		})
		.then(async (repo) => {
			return {
				discussions: await $discussionService.getDiscussions({
					page: page.value,
					orderBy: 'created_at',
					repository: repo.repository._id,
				}),
				repository: repo.repository,
			}
		})
	repository.value = dataFetch.repository
	discussions.value = dataFetch.discussions.discussions

	// Set isOwner
	isOwner.value = authStore.getUsername === repository.value?.owner.username
})
</script>

<template>
	<HTMLContainer orientation="V" :gap="10">
		<RepoNav
			v-if="repository"
			:is-owner="isOwner"
			:repo-name="repository?.name ?? ''"
			:owner="repository?.owner.username ?? ''"
		/>
		<section v-if="repository" class="Repository__body--content">
			<h2>
				{{ repository.name }} -
				<NuxtLink :to="`/${repository.owner.username}`">
					{{ repository.owner.full_name }} &lt;{{
						repository.owner.username
					}}>
				</NuxtLink>
			</h2>
			<DissCussions v-if="discussions" :discussions="discussions" />
		</section>
	</HTMLContainer>
</template>

<style scoped lang="scss">
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

.Repository__confg--input {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	align-items: center;
	gap: 20px;
	article {
		width: 100%;
	}
	button {
		height: 30px;
		width: 100%;
		max-width: 140px;
	}
}

.Repository__confg--list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	div {
		display: flex;
		gap: 8px;
		background-color: var(--color-bg);
		padding: 5px;
		border-radius: 5px;
		align-items: center;
	}
	button i {
		color: white;
		transition: all 0.4s;
	}
	:hover button i {
		color: var(--color-main);
	}
}

.Repository__content--delete {
	border: 1px solid var(--color-danger);
	border-radius: 5px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	article {
		display: flex;
		font-size: 0.9rem;
		button {
			font-size: 0.8rem;
		}
		justify-content: space-between;
	}
}
</style>
