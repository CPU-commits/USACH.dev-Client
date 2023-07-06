<script lang="ts" setup>
// @ts-ignore
import EmojiPicker from 'vue3-emoji-picker'

import 'vue3-emoji-picker/css'

const openPicker = ref(false)

// Emits
const emit = defineEmits<{
	(e: 'emoji', v: string): void
}>()

function selectEmoji(emoji: { i: string }) {
	openPicker.value = false
	emit('emoji', emoji.i)
}
</script>

<template>
	<aside class="EmojiPicker">
		<HTMLSimpleButton :click="() => (openPicker = !openPicker)">
			<i class="fa-solid fa-icons"></i>
		</HTMLSimpleButton>
		<EmojiPicker
			v-show="openPicker"
			:native="true"
			theme="dark"
			:hide-search="true"
			:group-names="{
				smileys_people: 'Sonrisas y personas',
				animals_nature: 'Animales y naturaleza',
				food_drink: 'Comida y bebidas',
				activities: 'Actividades',
				travel_places: 'Lugares de viaje',
				objects: 'Objetos',
				symbols: 'Simbolos',
				flags: 'Banderas',
			}"
			@select="selectEmoji"
		/>
	</aside>
</template>

<style scoped>
.EmojiPicker {
	position: relative;
}

.v3-emoji-picker {
	position: absolute;
	left: -285px;
	top: 0;
	z-index: var(--z-5);
}
</style>
