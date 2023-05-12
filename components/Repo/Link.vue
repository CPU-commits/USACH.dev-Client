<script lang="ts" setup>
import { LinkRepo } from '~~/models/repository/link.model'

defineProps<{
	link: LinkRepo
	isOwner: boolean
}>()

defineEmits<{
	(e: 'delete', _id: string): void
}>()
</script>

<template>
	<article class="Link">
		<NuxtLink :to="link.link">
			<span>
				<i
					v-if="link.type === 'drive'"
					class="fa-brands fa-google-drive"
				></i>
				<i
					v-else-if="link.type === 'github'"
					class="fa-brands fa-github"
				></i>
				<i
					v-else-if="link.type === 'cloud'"
					class="fa-solid fa-cloud"
				></i>
				<i
					v-else-if="link.type === 'pdf'"
					class="fa-solid fa-file-pdf"
				></i>
				<i
					v-else-if="link.type === 'youtube'"
					class="fa-brands fa-youtube"
				></i>
				<i v-else class="fa-solid fa-arrow-up-right-from-square"></i>
				{{ link.title }}
			</span>
		</NuxtLink>
		<HTMLSimpleButton
			v-if="isOwner"
			:click="() => $emit('delete', link._id)"
		>
			<i class="fa-solid fa-circle-minus"></i>
		</HTMLSimpleButton>
	</article>
</template>

<style lang="scss" scoped>
.Link {
	width: 100%;
	display: flex;
	justify-content: space-between;
	a {
		display: flex;
		justify-content: space-between;
	}
	button i {
		transition: all 0.4s;
	}
	button:hover i {
		color: var(--color-danger);
	}
}

a {
	text-decoration: none;
}
</style>
