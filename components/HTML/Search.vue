<script lang="ts" setup>
const props = defineProps<{
	value: string
	search: () => any
	placeholder?: string
}>()

defineEmits<{
	(e: 'update:value', value: string): void
}>()

function enter(key: string) {
	if (key === 'enter') {
		props.search()
	}
}
</script>

<template>
	<article>
		<input
			type="search"
			:placeholder="placeholder"
			:value="value"
			@keydown="($event) => enter($event.key)"
			@input="
				($event) =>
					$emit(
						'update:value',
						($event.target as HTMLInputElement).value,
					)
			"
		/>
		<HTMLButton type="button" :click="search">
			<i class="fa-solid fa-magnifying-glass"></i>
		</HTMLButton>
	</article>
</template>

<style lang="scss" scoped>
article {
	display: flex;
	gap: 5px;
	width: 100%;
}

input {
	background-color: var(--color-bg);
	border: none;
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	border-radius: 5px;
	transition: all 0.2s ease;
}

input:focus {
	outline: none;
	-webkit-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	-moz-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	box-shadow: 0.5px 1.5px 0 1.5px #000000;
}

button i {
	color: var(--color-bg);
}
</style>
