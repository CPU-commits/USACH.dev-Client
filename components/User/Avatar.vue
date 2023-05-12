<script lang="ts" setup>
defineProps<{
	src?: string
}>()

const defaultImg =
	'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg'
</script>

<template>
	<NuxtImg :src="src && src !== 'default' ? src : defaultImg" />
</template>

<style scoped>
img {
	width: 80px;
	height: 80px;
	object-fit: cover;
	border-radius: 60%;
	border: 2px solid black;
}
</style>
