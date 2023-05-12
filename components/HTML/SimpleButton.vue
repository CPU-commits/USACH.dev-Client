<script lang="ts" setup>
defineProps<{
	click: () => any
}>()
</script>

<template>
	<button type="button" @click="click"><slot /></button>
</template>

<style scoped>
button {
	border: none;
	background-color: transparent;
}
</style>
