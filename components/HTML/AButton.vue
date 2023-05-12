<script setup lang="ts">
defineProps<{
	href: string
}>()
</script>

<template>
	<NuxtLink :to="href">
		<slot />
	</NuxtLink>
</template>

<style lang="scss" scoped>
a {
	background-color: var(--color-main);
	color: var(--color-bg);
	padding: 8px;
	font-size: 0.9rem;
	border: none;
	border-radius: 5px;
	cursor: pointer;
	text-decoration: none;
}
</style>
