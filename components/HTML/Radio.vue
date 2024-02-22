<script lang="ts" setup>
defineProps<{
	inputs: Array<{
		value: string
		text: string
		description?: string
	}>
	name: string
	value: string
}>()

defineEmits<{
	(e: 'update:value', value: string): void
}>()
</script>

<template>
	<div class="Radio">
		<article v-for="(input, i) in inputs" :key="i" class="Radio__input">
			<input
				type="radio"
				:value="input.value"
				:name="name"
				:checked="input.value === value"
				@change="
					($event) =>
						$emit(
							'update:value',
							($event.target as HTMLInputElement).value,
						)
				"
			/>
			<div>
				<!-- eslint-disable-next-line vue/no-v-html -->
				<h4 v-html="input.text" />
				<!-- eslint-disable-next-line vue/no-v-html -->
				<small v-html="input.description" />
			</div>
		</article>
	</div>
</template>

<style lang="scss">
.Radio {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Radio__input {
	display: flex;
	align-items: center;
	gap: 10px;
	h4 {
		font-size: 1rem;
	}
}
</style>
