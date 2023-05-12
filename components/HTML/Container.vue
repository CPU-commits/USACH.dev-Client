<script lang="ts" setup>
withDefaults(
	defineProps<{
		orientation: 'H' | 'V'
		gap?: number
	}>(),
	{ orientation: 'H', gap: 20 },
)
</script>

<template>
	<div class="Container">
		<section
			:style="{ gap: `${gap}px` }"
			class="Content"
			:class="{ Vertical: orientation === 'V' }"
		>
			<slot />
		</section>
	</div>
</template>

<style scoped>
.Container {
	display: flex;
	justify-content: center;
}

.Vertical {
	flex-direction: column;
}

.Content {
	width: 100%;
	max-width: 1000px;
	padding: 20px;
	display: flex;
	gap: --gap;
	box-sizing: border-box;
}
</style>
