<script lang="ts" setup>
defineProps<{
	field: string
}>()
// Composables
const fieldErrors = useFieldErrors()
</script>

<template>
	<small v-if="field">
		{{ fieldErrors.get(field) }}
	</small>
</template>

<style scoped>
small {
	color: var(--color-danger);
}
</style>
