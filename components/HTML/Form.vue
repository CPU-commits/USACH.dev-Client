<script setup lang="ts">
defineProps<{
	action: () => any
}>()
</script>

<template>
	<form @submit.prevent="action">
		<slot />
	</form>
</template>

<style lang="scss" scoped>
form {
	background-color: var(--color-console);
	width: 100%;
	padding: 20px;
	box-sizing: border-box;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	gap: 8px;
}
</style>
