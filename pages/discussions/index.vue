<script lang="ts" setup>
import type { Discussion } from '@/models/dicussion/discussion'

// Nuxtapp
const { $discussionService } = useNuxtApp()
// Router
const route = useRoute()
const router = useRouter()

// Form
const search = ref((route.query?.search as string) ?? '')
const total = ref(0)

provide('total', total)
// Data
const discussions = ref<null | Array<Omit<Discussion, 'text'>>>(null)

onMounted(() => searchDiscussions(0, true))

async function searchDiscussions(page: number, count = false) {
	// Search data
	if (search.value !== '') router.push(`?search=${search.value}`)
	else if ((route.query.search as string) !== '') router.push('?search=')
	const dataFetch = await $discussionService.getDiscussions({
		page,
		orderBy: 'created_at',
		count,
		search: search.value,
	})
	if (dataFetch.total) total.value = dataFetch.total

	discussions.value = dataFetch.discussions ?? []
}
</script>

<template>
	<HTMLContainer orientation="V" :gap="10">
		<header class="Search">
			<HTMLSearch
				v-model:value="search"
				:search="() => searchDiscussions(0, true)"
				placeholder="Busquemos una discusión"
			/>
			<HTMLAButton href="/discussions/new">
				<i class="fa-solid fa-plus"></i>
			</HTMLAButton>
		</header>
		<section class="Discussions">
			<DissCussions v-if="discussions" :discussions="discussions" />
			<HTMLNav
				:navigate="{
					activate: true,
					fn: searchDiscussions,
					max: 15,
				}"
			/>
		</section>
	</HTMLContainer>
</template>

<style scoped lang="scss">
.Search {
	display: flex;
	gap: 10px;
	i {
		color: var(--color-console);
	}
}

.Discussions {
	margin-top: 10px;
	display: flex;
	flex-direction: column;
}

nav {
	background-color: var(--color-console);
	border-radius: 8px;
	padding: 5px;
}
</style>
