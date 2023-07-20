<template>
	<HTMLContainer class="Manifest__Container">
		<article class="Manifest">
			<div class="Manifest__content">
				<i>
					<strong>USACH.dev</strong> nace como una plataforma abierta
					desde los aportes de la comunidad y as&iacute; es como se
					mantedr&aacute;. Es completamente autogestionado por los
					usuarios y todas las opiniones se tendr&aacute;n en cuenta
					en la medida de lo posible.
				</i>
				<i>
					Aportes basados en c&oacute;mo se administra la plataforma,
					futuros cambios o desiciones de c&oacute;digo se
					recibir&aacute;n <strong>SOLO</strong> a trav&eacute;s de
					Github (el cual se abrir&aacute; una vez termine el periodo
					de prueba y factibilidad de USACH.dev).
				</i>
				<i>
					Todo el feedback de usabilidad, errores, entre otros. A
					trav&eacute;s del siguiente formulario.
				</i>
				<i>Comunidad, ayuda y tecnolog&iacute;a.</i>
			</div>

			<img src="/img/ship.jpg" alt="Barco" />
		</article>
	</HTMLContainer>
</template>

<style lang="scss">
.Manifest__Container .Content {
	justify-content: center;
	align-items: center;
}

.Manifest {
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	align-items: center;
	.Manifest__content {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 10px;
		i {
			max-width: 250px;
			text-align: center;
			padding-bottom: 10px;
		}
	}

	img {
		max-width: 300px;
		border-radius: 8px;
	}
}
</style>
