<script lang="ts" setup>
import { Comment } from 'models/comments/comment.model'

const props = defineProps<{
	comment: Comment
}>()

const replyEl = ref<ComponentPublicInstance | null>(null)
// Reply comment
defineEmits<{
	(e: 'comment', v: { comment: string; idComment: string }): void
}>()

const commentForm = ref({
	comment: '',
	idComment: props.comment._id,
})
const replyComment = ref(false)

function toggleReply() {
	replyComment.value = !replyComment.value
	setTimeout(() => {
		replyEl.value?.$el.focus()
	}, 100)
}
</script>

<template>
	<article class="Comment">
		<LazyDissCommentData
			:comment="comment"
			:is-parent-res="(comment.responses?.length ?? 0) > 0"
			:reply="replyComment"
			@reply="toggleReply"
		/>
		<LazyDissCommentData
			v-for="response in comment.responses"
			:key="response._id"
			:comment="response"
			:is-res="true"
			:reply="replyComment"
		/>

		<footer v-if="replyComment" class="Comment__reply">
			<HTMLTextArea
				ref="replyEl"
				v-model:value="commentForm.comment"
				:placeholder="`Responder a ${comment.author.full_name}...`"
			/>
			<HTMLButton
				type="button"
				title="Subir comentario"
				:click="
					() => {
						$emit('comment', commentForm)
						commentForm.comment = ''
						replyComment = false
					}
				"
			>
				<i class="fa-solid fa-arrow-up-from-bracket"></i>
			</HTMLButton>
		</footer>
	</article>
</template>

<style lang="scss">
.Comment:hover footer {
	visibility: visible;
}

.Comment__body {
	padding: 10px;
}

p {
	padding: 20px;
}

.Comment__reply {
	display: flex;
	gap: 10px;
	align-items: center;
	button {
		height: fit-content;
		i {
			color: var(--color-bg);
		}
	}
}
</style>
