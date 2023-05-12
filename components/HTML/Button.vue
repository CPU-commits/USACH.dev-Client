<script setup lang="ts">
defineProps<{
	type: 'button' | 'submit' | 'reset' | undefined
	click?: () => any
}>()
</script>

<template>
	<button :type="type" @click="click">
		<slot />
	</button>
</template>

<style lang="scss" scoped>
button {
	background-color: var(--color-main);
	color: var(--color-bg);
	padding: 8px;
	border: none;
	border-radius: 5px;
	cursor: pointer;
}
</style>
