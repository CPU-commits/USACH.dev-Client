<script setup lang="ts">
defineProps<{
	labelText?: string
	value: string
	type?: string
	field?: string
}>()

defineEmits<{
	(e: 'update:value', value: string): void
}>()
</script>

<template>
	<article>
		<label v-if="labelText" class="input__label">{{ labelText }}</label>
		<select
			@change="
				(e) =>
					$emit('update:value', (e.target as HTMLInputElement).value)
			"
		>
			<slot />
		</select>
		<HTMLInputMessage v-if="field" :field="field" />
	</article>
</template>

<style lang="scss" scoped>
select {
	background-color: var(--color-bg);
	border: none;
	width: 100%;
	padding: 10px;
	box-sizing: border-box;
	border-radius: 5px;
	transition: all 0.2s ease;
}

select:focus {
	outline: none;
	-webkit-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	-moz-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	box-shadow: 0.5px 1.5px 0 1.5px #000000;
}
</style>
