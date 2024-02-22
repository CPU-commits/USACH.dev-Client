<script lang="ts" setup>
// Types
import type { Discussion } from '~~/models/dicussion/discussion'
// NuxtApp
const { $discussionService } = useNuxtApp()
// Stores
const authStore = useAuthStore()
// Route
const route = useRoute()

const idDiscussion = route.params.diss as string
// Data
const discussion = ref<Discussion | null>(null)
const reactions = ref<Map<string, number> | null>(null)

onMounted(async () => {
	discussion.value = await $discussionService.getDiscussion(idDiscussion)

	reactions.value = new Map(
		discussion.value?.reactions?.map((reaction) => [
			reaction.reaction,
			reaction.count,
		]),
	)
})

const image = computed(() => {
	const {
		public: { API },
	} = useRuntimeConfig()

	return `${API}/api/v1/discussion/${discussion.value?._id}/${discussion.value?.image}`
})

function addReaction(reaction: string) {
	const currentReaction = reactions.value?.get(reaction) ?? 0
	reactions.value?.set(reaction, currentReaction + 1)
}
</script>

<template>
	<HTMLContainer orientation="V">
		<section v-if="discussion && reactions" class="Discussion">
			<h1>{{ discussion.title }}</h1>
			<figure>
				<img v-if="discussion.image" :src="image" />
				<figcaption>
					<small>
						{{ formatDate(discussion.created_at) }}
						<span
							v-if="
								discussion.created_at !== discussion.updated_at
							"
						>
							(editado)
						</span>
					</small>
				</figcaption>
			</figure>

			<p class="Discussion__snippet">{{ discussion.snippet }}</p>
			<HTMLRich :read-only="true" :body="discussion.text" />

			<footer class="Discussion__reactions">
				<ClientOnly v-if="authStore.isAuth">
					<DissReactions
						:reactions="reactions"
						:discussion="discussion"
					/>
					<Emoji @emoji="(e) => addReaction(e)" />
				</ClientOnly>
			</footer>
		</section>
		<DissComments v-if="discussion" :id-discussion="discussion?._id" />
	</HTMLContainer>
</template>

<style scoped>
.Discussion {
	background-color: var(--color-console);
	padding: 20px;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

h1 {
	text-align: center;
	font-size: 2rem;
}

img {
	width: 100%;
	object-fit: cover;
	max-height: 300px;
	border-radius: 10px;
}

.Discussion__snippet {
	background-color: var(--color-bg);
	border-radius: 5px;
	padding: 8px;
}

.Discussion__reactions {
	display: flex;
	justify-content: space-between;
}

@media (max-width: 575.98px) {
	.Discussion {
		padding: 10px;
	}
}
</style>
