<template>
	<div class="SpinnerGet">
		<div class="Loader" />
	</div>
</template>

<style lang="scss" scoped>
.SpinnerGet {
	position: fixed;
	width: 100%;
	height: 4px;
	top: 0;
	overflow: hidden;
	z-index: 999999;
}

.Loader {
	width: 100%;
	height: 100%;
	position: absolute;
	background: linear-gradient(45deg, #ffce1d, #ff6b1c);
	animation: load 3s ease-in-out infinite;
}

@keyframes load {
	0% {
		left: -100%;
	}
	100% {
		left: 100%;
	}
}
</style>
