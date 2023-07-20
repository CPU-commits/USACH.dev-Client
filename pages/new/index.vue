<script lang="ts" setup>
// Nuxtapp
const { $repoService } = useNuxtApp()
// Stores
const authStore = useAuthStore()

const repo = {
	name: '',
	description: '',
	access: '',
}
const inputs = [
	{
		value: 'public',
		text: '<i class="fa-solid fa-globe"></i> Publico',
		description: 'Todo el mundo tiene acceso a este repositorio',
	},
	{
		value: 'private',
		text: '<i class="fa-solid fa-lock"></i> Privado',
		description:
			'Solo personas con el enlace del repositorio pueden acceder',
	},
	{
		value: 'private-group',
		text: '<i class="fa-solid fa-key"></i> Privado a grupos',
		description:
			'Solo usuarios especificamente seleccionados por usted tienen acceso',
	},
]
</script>

<template>
	<HTMLContainer>
		<HTMLForm
			:action="() => $repoService.uploadRepository(repo)"
			class="NewRepo"
		>
			<h2>Nuevo repositorio</h2>

			<article class="NewRepo__basic">
				<h4>Nombre</h4>
				<div class="NewRepo__basic--name">
					<span>{{ authStore.getUsername }} /</span>
					<HTMLInput v-model:value="repo.name" field="name" />
					<small>
						Solo minisculas, n&uacute;meros y _ como c&aacute;racter
					</small>
				</div>
				<h4>Descripci&oacute;n (opcional)</h4>
				<HTMLInput
					v-model:value="repo.description"
					field="description"
				/>
				<h4>Acceso</h4>
				<HTMLRadio
					v-model:value="repo.access"
					name="access"
					:inputs="inputs"
				/>
				<br />
			</article>
			<HTMLButton type="submit"> Agregar repositorio </HTMLButton>
		</HTMLForm>
	</HTMLContainer>
</template>

<style scoped lang="scss">
.NewRepo {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

h2 {
	padding: 5px;
	border-bottom: 1px solid;
}

.NewRepo__basic {
	border-bottom: 1px solid var(--color-bg);
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.NewRepo__basic--name {
	display: flex;
	gap: 5px;
	border: 2px solid;
	border-radius: 8px;
	padding: 8px;
	margin: 8px;
	width: fit-content;
	align-items: center;
}

@media (max-width: 575.98px) {
	.NewRepo {
		padding: 10px;
	}
}
</style>
