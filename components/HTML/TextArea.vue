<script lang="ts" setup>
const props = withDefaults(
	defineProps<{
		placeholder?: string
		inputStyle?: boolean
		actionAfter?: {
			action: (text: string) => void
			timeInSeconds: number
		} | null
	}>(),
	{ inputStyle: true, placeholder: '', actionAfter: null },
)

const emit = defineEmits<{
	(e: 'update:value', value: string): void
}>()

// Timeout
let timeout: NodeJS.Timeout | null = null

function onInput(text: string) {
	emit('update:value', text)
	// Action after
	if (props.actionAfter) {
		if (timeout) clearTimeout(timeout)

		timeout = setTimeout(
			() => props.actionAfter?.action(text),
			props.actionAfter.timeInSeconds * 1000,
		)
	}
}
</script>

<template>
	<textarea
		:class="{ Input: inputStyle, NotInput: !inputStyle }"
		:placeholder="placeholder"
		@input="$event =>
				onInput(($event.target as HTMLInputElement).value)
			"
	/>
</template>

<style lang="scss" scoped>
textarea {
	background-color: var(--color-bg);
	border: none;
	width: 100%;
	box-sizing: border-box;
	border-radius: 5px;
	transition: all 0.2s ease;
	resize: none;
}

textarea:focus {
	outline: none;
}

.Input:focus {
	-webkit-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	-moz-box-shadow: 0.5px 1.5px 0 1.5px #000000;
	box-shadow: 0.5px 1.5px 0 1.5px #000000;
}

.Input {
	padding: 10px;
}

.NotInput {
	font-size: 0.9rem;
}
</style>
