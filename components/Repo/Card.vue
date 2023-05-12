<script lang="ts" setup>
// Types
import type { Repository } from '~~/models/repository/repo.model'

const data = defineProps<{
	repository: Repository
	owner?: string
}>()

const hightlight = data.repository.stars > 20
</script>

<template>
	<a :href="`/${owner}/${repository.name}`">
		<article class="Repo" :class="{ RepoPlus: hightlight }">
			<header>
				<h3>
					<i v-if="hightlight" class="fa-solid fa-star"></i>
					{{ capitalizeFirstLetter(repository.name) }}
					<span v-if="repository.owner?.full_name">
						- &lt;{{ repository.owner.full_name }}>
					</span>
				</h3>
				<div>
					<span class="material-symbols-outlined">
						magic_button
					</span>
					<span>{{ repository.stars }}</span>
				</div>
			</header>
			<footer>
				<small>
					&Uacute;ltima actualizaci&oacute;n
					{{ formatDate(repository.updated_date ?? '') }}
					<span v-for="tag in repository.tags" :key="tag">
						#{{ tag }}
					</span>
				</small>
				<small>
					Subido {{ formatDate(repository.created_date ?? '') }}
				</small>
			</footer>
		</article>
	</a>
</template>

<style scoped lang="scss">
a {
	text-decoration: none;
}

.Repo {
	width: 100%;
	padding: 8px;
	box-sizing: border-box;
	border-bottom: 2px solid;
	background-color: var(--color-bg);
	border-top-right-radius: 8px;
	border-top-left-radius: 8px;
	transition: all 0.4s ease;
	h3,
	span {
		transition: all 0.4s ease;
	}
}

.Repo:hover {
	-moz-box-shadow: 3px 3px 0 2px #000000;
	box-shadow: 3px 3px 0 2px #000000;
	h3,
	span {
		color: var(--color-main);
	}
}

.RepoPlus {
	border-bottom: 2px solid var(--color-main);
	h3,
	.fa-star,
	span {
		color: var(--color-main);
	}
}

.RepoPlus:hover {
	-moz-box-shadow: 3px 3px 0 2px var(--color-main);
	box-shadow: 3px 3px 0 2px var(--color-main);
}

header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px;
	div {
		display: flex;
		align-items: center;
	}
}

footer {
	display: flex;
	justify-content: space-between;
	small {
		font-size: 0.6rem;
	}
}
</style>
