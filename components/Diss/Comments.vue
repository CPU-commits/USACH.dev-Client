<script lang="ts" setup>
// Socket IO
import { Socket, io } from 'socket.io-client'
import type { Comment } from '@/models/comments/comment.model'
import type { User } from '@/models/user/user.model'

const props = defineProps<{
	idDiscussion: string
}>()
// NuxtApp
const { $commentService } = useNuxtApp()
// Stores
const authStore = useAuthStore()

// Data
const comments = ref<Array<Comment> | null>(null)
const comment = ref({
	comment: '',
})
// Socket
let socket: Socket | null = null

onMounted(async () => {
	const dataFetchPromise = $commentService.getComments(props.idDiscussion)
	// Config
	if (authStore.isAuth) {
		const {
			public: { WS },
		} = useRuntimeConfig()

		socket = io(`${WS}/discussions`, {
			extraHeaders: {
				Authorization: `Bearer ${authStore.getToken ?? ''}`,
				'X-Discussion': props.idDiscussion,
			},
		})

		socket.on(
			'discussions:comment',
			(msg: Comment & { is_res: boolean; res_to?: string }) => {
				setTimeout(() => {
					if (
						!msg.is_res &&
						!comments.value?.some((c) => c._id === msg._id)
					)
						addComment(msg, msg.is_res)
					else if (
						msg.is_res &&
						!comments.value?.some((c) =>
							c.responses?.some((r) => r._id === msg._id),
						)
					)
						addComment(msg, msg.is_res, msg.res_to)
				}, 500)
			},
		)
	}

	comments.value = await dataFetchPromise
})

onUnmounted(() => {
	if (socket) socket.disconnect()
})

// Upload comment
function addComment(newComment: Comment, isRes: boolean, resTo?: string) {
	if (!comments.value) comments.value = []

	if (comments.value && !isRes) {
		comments.value = [newComment].concat(comments.value)
	} else if (comments.value) {
		const commentToAppendRes = comments.value.find((c) => c._id === resTo)
		if (commentToAppendRes && !commentToAppendRes?.responses)
			commentToAppendRes.responses = []
		commentToAppendRes?.responses?.push(newComment)
	}
}

async function uploadComment(
	comment: string,
	idComment = null as string | null,
) {
	const idInserted = await $commentService.comment(
		{ comment },
		props.idDiscussion,
		idComment ? { isReply: true, idComment } : undefined,
	)
	// Format comment
	const newComment = {
		author: {
			username: authStore.getUsername,
			full_name: authStore.getName,
		} as User,
		_id: idInserted as string,
		comment,
		created_at: new Date().toString(),
		updated_at: new Date().toString(),
	}
	if (idInserted) addComment(newComment, idComment !== null, idComment ?? '')
}
</script>

<template>
	<section class="Comments">
		<h2>Comentarios <i class="fa-solid fa-comments"></i></h2>
		<div v-if="authStore.isAuth" class="Comments__comment">
			<HTMLTextArea
				v-model:value="comment.comment"
				placeholder="¿Algo que comentar...?"
			/>
			<HTMLButton
				type="button"
				title="Subir comentario"
				:click="() => uploadComment(comment.comment)"
			>
				<i class="fa-solid fa-arrow-up-from-bracket"></i>
			</HTMLButton>
		</div>
		<section v-if="comments" class="Coomments__area">
			<DissComment
				v-for="comment in comments"
				:key="comment._id"
				:comment="comment"
				@comment="
					(comment) =>
						uploadComment(comment.comment, comment.idComment)
				"
			/>
		</section>
	</section>
</template>

<style scoped lang="scss">
.Comments {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Comments__comment {
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

.Coomments__area {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
