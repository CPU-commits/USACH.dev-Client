<script lang="ts" setup>
// Models
import type { Discussion } from '@/models/dicussion/discussion'

const props = defineProps<{
	discussions: Array<Omit<Discussion, 'text'>>
}>()

const discussions = toRef(props, 'discussions')
</script>

<template>
	<section class="Discussions">
		<DissCard
			v-for="discussion in discussions"
			:key="discussion._id"
			:discussion="discussion"
		/>
	</section>
</template>

<style scoped>
.Discussions {
	display: flex;
	flex-direction: column;
	gap: 20px;
}
</style>
