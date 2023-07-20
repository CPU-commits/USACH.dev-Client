<script lang="ts" setup>
// Types
import type { SystemFile } from '~~/models/repository/system_file.model'
// Router
const route = useRoute()

const props = defineProps<{
	element: SystemFile
	repoName: string
	isOwner: boolean
}>()

defineEmits<{
	(e: 'delete', v: string): void
	(e: 'download', v: string): void
}>()

const path = computed(() => {
	const cuted = route.fullPath.split('/')
	cuted.length = 3
	return `${cuted.join('/')}/${props.element._id}`
})
</script>

<template>
	<NuxtLink :to="element.is_directory ? path : ''">
		<article class="Element">
			<span>
				<i v-if="element.is_directory" class="fa-solid fa-folder"></i>
				<i v-else class="fa-regular fa-file"></i>
				{{ element.name }}
			</span>
			<span>
				{{ formatDate(element.date) }}
				<HTMLSimpleButton :click="() => $emit('download', element._id)">
					<i
						v-if="!element.is_directory"
						class="fa-solid fa-file-arrow-down"
					/>
					<i v-else class="fa-solid fa-file-zipper"></i>
				</HTMLSimpleButton>
				<HTMLSimpleButton
					v-if="isOwner"
					title="Eliminar"
					:click="() => $emit('delete', element._id)"
				>
					<i class="fa-solid fa-delete-left Delete"></i>
				</HTMLSimpleButton>
			</span>
		</article>
	</NuxtLink>
</template>

<style scoped>
a {
	text-decoration: none;
}

.Element {
	width: 100%;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid;
	gap: 15px;
	padding: 5px;
	box-sizing: border-box;
}

span {
	display: flex;
	font-size: 0.9rem;
	gap: 10px;
	max-width: 600px;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

button i {
	transition: all 0.4s ease;
}

button .Delete:hover {
	color: var(--color-danger);
}

@media (max-width: 575.98px) {
	span {
		max-width: 170px;
	}
}
</style>
