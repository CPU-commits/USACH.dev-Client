<script lang="ts" setup>
const inputEl = ref<HTMLInputElement | null>(null)

onMounted(() => {
	inputEl.value?.focus()
})
// Emits
const emits = defineEmits<{
	(e: 'folderName', value: string): void
}>()

function emitValue() {
	emits('folderName', inputEl.value?.value ?? '')
}
</script>

<template>
	<article class="Element">
		<span>
			<i class="fa-solid fa-folder"></i>
			<input
				ref="inputEl"
				type="text"
				@keydown="
					($event) => {
						if ($event.key === 'Enter') emitValue()
					}
				"
				@focusout="() => emitValue()"
			/>
		</span>
	</article>
</template>

<style scoped>
.Element {
	width: 100%;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid;
	gap: 15px;
	padding: 5px;
	box-sizing: border-box;
}

input {
	background-color: transparent;
	border: 1px solid var(--color-bg);
	border-radius: 2px;
	padding: 1px;
	width: 100%;
}

input:focus {
	outline: none;
}

span {
	display: flex;
	width: 100%;
	align-items: center;
	gap: 10px;
}
</style>
