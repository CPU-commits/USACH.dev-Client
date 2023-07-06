<script lang="ts" setup>
// Types
import { Discussion } from '~~/models/dicussion/discussion'
// NuxtApp
const { $discussionService } = useNuxtApp()
// Stores
const toastsStore = useToastsStore()

const props = defineProps<{
	reactions: Map<string, number>
	discussion: Omit<Discussion, 'text'>
}>()

watch(
	() => [...props.reactions],
	(newReactionsArray, oldReactionsArray) => {
		const newReactions = new Map(newReactionsArray)
		const oldReactions = new Map(oldReactionsArray)

		let newReaction = ''
		for (const [reaction, count] of newReactions) {
			const oldCount = oldReactions.get(reaction)
			if (oldCount === undefined || oldCount < count) {
				newReaction = reaction
				break
			}
		}
		if (newReaction !== '') react(newReaction)
	},
	{ deep: true },
)

// Functions
async function react(reaction: string) {
	try {
		const idDiscussion = props.discussion._id
		await $discussionService.react(idDiscussion, reaction)
		// Delete old reaction
		const discussion = props.discussion

		if (discussion?.user_reaction) {
			const oldReaction =
				props.reactions.get(discussion.user_reaction.reaction) ?? 0
			if (oldReaction > 1)
				props.reactions.set(
					discussion.user_reaction.reaction,
					oldReaction - 1,
				)
			else props.reactions.delete(discussion.user_reaction.reaction)
		}
		// Set new use reaction
		if (discussion)
			discussion.user_reaction = {
				reaction,
			}
	} catch (err) {
		// Delete added reaction
		const oldCount = props.reactions.get(reaction) ?? 0
		if (oldCount > 1) props.reactions.set(reaction, oldCount - 1)
		else props.reactions.delete(reaction)

		toastsStore.addToast({
			message: 'Ha ocurrido un error al reaccionar',
			type: 'error',
		})
	}
}

async function deleteReaction() {
	try {
		await $discussionService.deleteReaction(props.discussion._id)

		const discussion = props.discussion
		if (discussion && discussion.user_reaction) {
			const oldReaction =
				props.reactions.get(discussion.user_reaction.reaction) ?? 0
			if (oldReaction > 1)
				props.reactions.set(
					discussion.user_reaction.reaction,
					oldReaction - 1,
				)
			else props.reactions.delete(discussion.user_reaction.reaction)
		}
	} catch (err) {
		toastsStore.addToast({
			message: 'Ha ocurrido un error al eliminar reacción',
			type: 'error',
		})
	}
}
</script>

<template>
	<section class="Reactions">
		<HTMLSimpleButton
			v-for="[reaction, number] in reactions.entries()"
			:key="reaction"
			class="Reactions__reaction"
			:click="
				() => {
					if (discussion.user_reaction?.reaction === reaction)
						deleteReaction()
				}
			"
			:class="{
				Selected: discussion.user_reaction?.reaction === reaction,
			}"
		>
			<span>{{ reaction }} {{ number }}</span>
		</HTMLSimpleButton>
	</section>
</template>

<style scoped lang="scss">
.Reactions {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
}

.Reactions__reaction {
	background-color: var(--color-bg);
	width: fit-content;
	border-radius: 5px;
	padding: 3px;
	display: flex;
	border: 1px solid transparent;
	span {
		font-size: 0.8rem;
	}
}

.Selected {
	border: 1px solid var(--color-main);
}
</style>
