<script lang="ts" setup>
// Types
import { Discussion } from '~~/models/dicussion/discussion'

const props = defineProps<{
	discussion: Omit<Discussion, 'text'>
}>()
// Stores
const authStore = useAuthStore()

const discussion = toRef(props, 'discussion')
const reactions = ref(
	new Map(
		discussion.value.reactions?.map((reaction) => [
			reaction.reaction,
			reaction.count,
		]),
	),
)

defineEmits<{
	(
		e: 'react',
		v: {
			idDiscussion: string
			reaction: string
			reactions: Map<string, number>
		},
	): void
}>()

const image = computed(() => {
	const {
		public: { API },
	} = useRuntimeConfig()

	return `${API}/api/v1/discussion/${props.discussion._id}/${props.discussion.image}`
})

function addReaction(reaction: string) {
	const currentReaction = reactions.value.get(reaction) ?? 0
	reactions.value.set(reaction, currentReaction + 1)
}
</script>

<template>
	<article class="DissCard">
		<aside v-if="authStore.isAuth" class="DissCard__actions">
			<Emoji @emoji="(e) => addReaction(e)" />
		</aside>
		<div class="DissCard__content">
			<NuxtLink :to="`/discussions/${discussion.code}`" :prefetch="true">
				<header>
					<div>
						<h3>{{ discussion.title }}</h3>
						<p>{{ discussion.snippet }}</p>
					</div>
				</header>
			</NuxtLink>
			<footer class="DissCard__content--footer">
				<!--<small>
					<i class="fa-solid fa-message"></i>
					0
				</small>-->
				<small>
					{{ formatDate(discussion.created_at) }}
					<span
						v-if="discussion.created_at !== discussion.updated_at"
					>
						(editado)
					</span>
				</small>
				<DissReactions
					:reactions="reactions"
					:discussion="discussion"
				/>
			</footer>
		</div>
		<NuxtImg v-if="discussion.image" :src="image" :alt="discussion.title" />
	</article>
</template>

<style scoped lang="scss">
a {
	text-decoration: none;
}

.DissCard {
	position: relative;
	background-color: var(--color-console);
	width: 100%;
	padding: 15px 20px;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
}

.DissCard:hover .DissCard__actions {
	visibility: visible;
}

.DissCard__actions {
	visibility: hidden;
	position: absolute;
	right: -10px;
	top: -10px;
	background-color: var(--color-bg);
	min-width: 50px;
	display: flex;
	justify-content: space-around;
	border-radius: 3px;
	padding: 2px;
	border: 1px solid;
}

.DissCard__content {
	width: 100%;
	display: flex;
	gap: 20px;
	flex-direction: column;
	justify-content: space-between;
}

.DissCard img {
	max-height: 100px;
	border-radius: 8px;
	object-fit: cover;
}

.DissCard__content--footer {
	display: flex;
	align-items: center;
	gap: 10px;
}
</style>
