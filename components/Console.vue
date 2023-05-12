<script setup lang="ts">
defineProps<{
	lang: 'markdown'
	label: string
}>()
</script>

<template>
	<div class="Console">
		<header class="Console__header">
			<div class="tools">
				<div class="circle">
					<span class="box"></span>
				</div>
				<div class="circle">
					<span class="box"></span>
				</div>
				<div class="circle">
					<span class="box"></span>
				</div>
			</div>
			<span>{{ label }}</span>
		</header>
		<div class="Console__content">
			<slot />
		</div>
		<footer class="Console__footer">
			<span>[{{ lang }}]</span>
		</footer>
	</div>
</template>

<style lang="scss">
.Console {
	width: fit-content;
	min-height: 300px;
	margin: 0 auto;
	background-color: var(--color-console);
	border-radius: 8px;
	z-index: 1;
	position: relative;
}

.Console__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	span {
		font-size: 0.8rem;
		color: var(--color-main);
		font-weight: 500;
	}
	padding: 8px;
}

.tools {
	display: flex;
	align-items: center;
}

.circle {
	padding: 0 4px;
}

.box {
	display: inline-block;
	align-items: center;
	width: 10px;
	height: 10px;
	padding: 1px;
	border-radius: 50%;
	background-color: #535353;
}

.Console__content {
	padding: 10px;
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.Console__line {
	display: flex;
	align-items: center;
	gap: 6px;
	span {
		color: var(--color-main);
	}
}

.Console__hightlight {
	color: var(--color-main);
}

.Console__footer {
	position: absolute;
	bottom: 0;
	display: flex;
	justify-content: center;
	margin-bottom: 10px;
	width: 100%;
	span {
		font-weight: bold;
	}
}
</style>
