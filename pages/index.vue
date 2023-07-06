<script setup lang="ts"></script>

<template>
	<main class="Main">
		<section class="Main__banner">
			<Honeycomb />
			<article>
				<h2><i class="fa-solid fa-cubes"></i> USACH.dev</h2>
				<h4>
					Red de repositorios [Honeycomb] de apuntes públicos
					autogestionada por la comunidad 😎
				</h4>
			</article>
		</section>
		<section class="Main__know">
			<h3>¿Qu&eacute; es USACH.dev?</h3>
			<section class="Main__know--content">
				<Console label="⚗️ /USACH.dev/calculo-1" :lang="'Repositorio'">
					<h2 class="Console__title">
						UnGranRepositorio - Tú &lt;tu-user>
					</h2>
					<img src="/img/404.svg" alt="Contenido" />
				</Console>
				<article class="Main__content--text">
					<p>
						<i class="fa-brands fa-hive"></i> Es una red de
						repositorios para publicar apuntes o material de la
						carrera.
					</p>
					<p>
						<i class="fa-solid fa-wand-sparkles"></i> Autogestionado
						por la comunidad. P&uacute;ntua con polvo estelar
						sumando un punto, o restando uno.
					</p>
					<p>
						<i class="fa-solid fa-book-skull"></i> A los -5 puntos
						es GAME OVER.
					</p>
					<p>
						<i class="fa-solid fa-star Console__hightlight"></i>
						Adorna tu repositorio con una estrella dorada a los 20
						puntos.
					</p>
					<p>
						<i class="fa-solid fa-file-lines"></i> Basada en
						documentos.
					</p>
				</article>
			</section>
		</section>
	</main>
</template>

<style lang="scss" scoped>
.Main__banner {
	background-color: var(--color-main);
	color: var(--color-bg);
	position: relative;
	display: flex;
	padding: 40px;
	justify-content: space-evenly;
	align-items: center;
	h2 {
		font-size: 2rem;
		color: var(--color-bg);
	}
	i {
		color: var(--color-bg);
	}
	h4 {
		color: var(--color-bg);
		max-width: 400px;
	}
}

.Main__know {
	display: flex;
	flex-direction: column;
	gap: 30px;
	align-items: center;
	margin-top: 25px;
	h3 {
		font-size: 1.5rem;
	}
	.Main__know--content {
		display: flex;
		justify-content: space-evenly;
		gap: 30px;
		align-items: center;
		.Main__content--text {
			display: flex;
			flex-direction: column;
			max-width: 300px;
			gap: 10px;
			text-align: center;
		}
	}
}

.Console__title {
	font-size: 1rem;
	text-align: center;
}

img {
	width: 100%;
	max-width: 300px;
}
</style>
