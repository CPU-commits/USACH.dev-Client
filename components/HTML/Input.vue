<script setup lang="ts">
defineProps<{
	labelText?: string
	value: string
	type?: string
	field?: string
	placeholder?: string
}>()

defineEmits<{
	(e: 'update:value', value: string): void
}>()
</script>

<template>
	<article>
		<label v-if="labelText" class="input__label">{{ labelText }}</label>
		<input
			:value="value"
			class="input__field"
			:type="type ? type : 'text'"
			:placeholder="placeholder"
			@input="$event =>
				$emit('update:value', ($event.target as HTMLInputElement).value)
			"
		/>
		<HTMLInputMessage v-if="field" :field="field" />
	</article>
</template>

<style lang="scss" scoped>
article {
	display: flex;
	flex-direction: column;
	gap: 5px;
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
</style>
