<script lang="ts" setup>
import type { Comment } from '@/models/comments/comment.model'

defineProps<{
	comment: Comment
	isRes?: boolean
	isParentRes?: boolean
	reply: boolean
}>()

defineEmits<{
	(e: 'reply', v: void): void
}>()
// Services
const { $userService } = useNuxtApp()
// Stores
const authStore = useAuthStore()
</script>

<template>
	<div class="Comment__content">
		<header class="Comment__profile">
			<UserAvatar
				size="small"
				:src="$userService.getAvatar(comment.author.username)"
			/>
			<footer
				v-if="!isRes && authStore.isAuth"
				class="Comment__profile--reply"
			>
				<HTMLSimpleButton :click="() => $emit('reply')">
					<i :class="{ Selected: reply }" class="fa-solid fa-reply" />
					Responder
				</HTMLSimpleButton>
			</footer>
		</header>
		<aside v-if="isRes || isParentRes" class="Timeline" />
		<div class="Comment__body">
			<header class="Comment__body--header">
				<h2>
					{{ comment.author.full_name }}
					&lt;{{ comment.author.username }}>
				</h2>
				<small>{{ timeAgo(comment.updated_at) }}</small>
			</header>
			<p>{{ comment.comment }}</p>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.Comment__content {
	display: grid;
	position: relative;
	grid-template-columns: 100px 1fr;
}

.Comment__body {
	padding: 10px;
	position: relative;
}

.Comment__body--header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: var(--color-console);
	padding: 5px;
	border-top-left-radius: 8px;
	border-top-right-radius: 8px;
	h2 {
		font-size: 0.9rem;
	}
}

.Comment__profile--reply {
	visibility: hidden;
}

footer button {
	display: flex;
	gap: 2px;
	font-size: 0.7rem;
}

.Timeline {
	position: absolute;
	height: 100%;
	width: 2px;
	left: 50px;
	background-color: var(--color-text);
	z-index: -1;
}

.Comment__profile {
	display: flex;
	flex-direction: column;
	align-items: center;
	padding: 10px;
	justify-content: space-between;
}

p {
	padding: 20px;
}

.Selected {
	color: var(--color-main);
}

@media (max-width: 575.98px) {
	.Comment__content {
		grid-template-columns: 50px 1fr;
	}

	.Timeline {
		left: 25px;
	}
}
</style>
