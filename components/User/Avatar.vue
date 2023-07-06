<script lang="ts" setup>
const props = defineProps<{
	src?: string
	size?: 'small' | 'normal'
	editable?: boolean
}>()

const emit = defineEmits<{
	(e: 'image', v: File): void
}>()

const srcImage = ref(
	props.src
		? props.src === 'default'
			? 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg'
			: props.src
		: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg',
)

// Edit image
const inputFile = ref<HTMLInputElement | null>(null)

function changeImage() {
	const files = inputFile.value?.files
	if (files && (files?.length ?? 0) > 0) {
		const file = files[0]
		if (file.type.includes('image')) {
			const fileReader = new FileReader()
			fileReader.onload = () => {
				// Emit image
				emit('image', file)
				srcImage.value = fileReader.result as string
			}
			fileReader.readAsDataURL(file)
		}
	}
}
</script>

<template>
	<div>
		<NuxtImg
			:class="{
				NormalSize: size === 'normal' || !size,
				SmallSize: size && size === 'small',
			}"
			:src="srcImage"
			@click="
				() => {
					if (editable) inputFile?.click()
				}
			"
			@error="
				() =>
					(srcImage =
						'https://upload.wikimedia.org/wikipedia/commons/e/e8/Deno_2021.svg')
			"
		/>
		<input ref="inputFile" type="file" @change="changeImage" />
	</div>
</template>

<style scoped>
img {
	object-fit: cover;
	border-radius: 60%;
	border: 2px solid black;
}

.SmallSize {
	width: 45px;
	height: 45px;
}

.NormalSize {
	width: 80px;
	height: 80px;
}

input {
	display: none;
}
</style>
