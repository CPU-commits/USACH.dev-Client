<script setup lang="ts">
import Toasts from '~~/components/Toast/Toasts.vue'
const spinner = useSpinner()
</script>

<template>
	<main>
		<!-- Loading -->
		<Loading v-if="spinner" />
		<!-- Toasts -->
		<Toasts />
		<!-- Header -->
		<Header />
		<!-- Content main -->
		<slot />
	</main>
</template>
