<script lang="ts" setup>
defineProps<{
	isOwner: boolean
	repoName: string
	owner: string
}>()
</script>

<template>
	<nav>
		<ul>
			<NuxtLink :to="`/${owner}/${repoName}`">
				<li><i class="fa-solid fa-boxes-packing"></i> Repositorio</li>
			</NuxtLink>
			<NuxtLink :to="`/${owner}/${repoName}/discussions`">
				<li><i class="fa-solid fa-comments"></i> Discusiones</li>
			</NuxtLink>
			<NuxtLink
				v-if="isOwner"
				:to="`/${owner}/${repoName}/configuration`"
			>
				<li><i class="fa-solid fa-sliders"></i> Configuraciones</li>
			</NuxtLink>
		</ul>
	</nav>
</template>

<style scoped>
nav {
	width: 100%;
	border-radius: 5px;
	border: 1px solid;
}

ul {
	display: flex;
	justify-content: space-around;
	list-style: none;
}

li {
	padding: 8px;
}

a {
	text-decoration: none;
}
</style>
