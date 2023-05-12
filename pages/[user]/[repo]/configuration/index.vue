<script lang="ts" setup>
import { Repository } from '~~/models/repository/repo.model'

// Nuxt app
const { $repoService, $fetchModule } = useNuxtApp()
// Stores
const authStore = useAuthStore()
const toastsStore = useToastsStore()
// Route
const router = useRouter()
const route = useRoute()

const username = route.params.user
const repoName = route.params.repo

// Modals
const modalTag = ref(false)
const toggleModalTag = () => (modalTag.value = !modalTag.value)
// Data
const repository = ref<null | Repository>(null)
const isOwner = ref(false)
// Form
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

const formConfg = ref({
	description: '',
	access: '',
	tags: [] as Array<string>,
	custom_access: [] as Array<string>,
})
const userForm = ref('')
const tagName = ref('')

onMounted(async () => {
	const dataFetch = await $repoService.getRepo({
		username: username as string,
		repository: repoName as string,
	})
	repository.value = dataFetch.repository

	// Set isOwner
	isOwner.value = authStore.getUsername === repository.value?.owner.username
	setForm()
})

function setForm() {
	formConfg.value.description = repository.value?.description ?? ''
	formConfg.value.access = repository.value?.access ?? ''
	formConfg.value.tags = repository.value?.tags ?? []
}

function addToCustomArray(
	array: 'custom_access' | 'tags',
	...users: Array<string>
) {
	if (
		array === 'custom_access' &&
		!users.every((user) => isValidUsername(user))
	)
		toastsStore.addToast({
			message: 'Todos los usuarios deben ser válidos',
			type: 'error',
		})
	else if (users.every((user) => formConfg.value[array].includes(user)))
		toastsStore.addToast({
			message: 'No se puede repetir un usuario',
			type: 'error',
		})
	else {
		formConfg.value[array].push(...users)
		userForm.value = ''
	}
}

function deleteToCustomArray(
	array: 'custom_access' | 'tags',
	toDelete: string,
) {
	formConfg.value[array] = formConfg.value[array].filter(
		(user) => user !== toDelete,
	)
}

async function updateRepository() {
	try {
		await $repoService.updateRepository(
			repository.value?._id ?? '',
			formConfg.value,
		)
		toastsStore.addToast({
			message: 'Se ha actualizado el repositorio correctamente',
			type: 'success',
		})
	} catch (err) {
		const error = $fetchModule.handleError(err)
		toastsStore.addToast({
			message: error.message,
			type: 'error',
		})
	}
}

async function deleteRepository() {
	try {
		await $repoService.deleteRepository(repository.value?._id ?? '')
		router.push(
			`/${repository.value?.owner.username}/${repository.value?.name}`,
		)
	} catch (err) {
		const error = $fetchModule.handleError(err)
		toastsStore.addToast({
			message: error.message,
			type: 'error',
		})
	}
}
</script>

<template>
	<HTMLContainer orientation="V" :gap="10">
		<RepoNav
			v-if="repository"
			:is-owner="isOwner"
			:repo-name="repository?.name ?? ''"
			:owner="repository?.owner.username ?? ''"
		/>
		<section v-if="repository" class="Repository__body--content">
			<h2>
				{{ repository.name }} -
				<NuxtLink :to="`/${repository.owner.username}`">
					{{ repository.owner.full_name }} &lt;{{
						repository.owner.username
					}}>
				</NuxtLink>
			</h2>
			<HTMLForm
				class="Repository__body--confg"
				:action="updateRepository"
			>
				<HTMLInput
					v-model:value="formConfg.description"
					label-text="Descripción"
					field="description"
				/>
				<h4><i class="fa-solid fa-tags"></i> Etiquetas</h4>
				<section class="Repository__confg--list">
					<div v-for="(tag, i) in formConfg.tags" :key="i">
						<span>{{ tag }}</span>
						<HTMLSimpleButton
							:click="() => deleteToCustomArray('tags', tag)"
						>
							<i class="fa-solid fa-circle-minus"></i>
						</HTMLSimpleButton>
					</div>
				</section>
				<HTMLButton type="button" :click="toggleModalTag">
					<i class="fa-solid fa-plus"></i>
					<i class="fa-solid fa-tag"></i>
				</HTMLButton>
				<h4>Acceso</h4>
				<HTMLRadio
					v-model:value="formConfg.access"
					name="access"
					:inputs="inputs"
				/>
				<template v-if="formConfg.access === 'private-group'">
					<div class="Repository__confg--input">
						<HTMLInput
							v-model:value="userForm"
							label-text="Usuarios con acceso"
							field="custom_access"
						/>
						<HTMLButton
							type="button"
							:click="
								() =>
									addToCustomArray('custom_access', userForm)
							"
						>
							<i class="fa-solid fa-user-plus"></i> Agregar
							usuario
						</HTMLButton>
					</div>
					<section class="Repository__confg--list">
						<div
							v-for="(user, i) in formConfg.custom_access"
							:key="i"
						>
							<span>{{ user }}</span>
							<HTMLSimpleButton
								:click="
									() =>
										deleteToCustomArray(
											'custom_access',
											user,
										)
								"
							>
								<i class="fa-solid fa-circle-minus"></i>
							</HTMLSimpleButton>
						</div>
					</section>
				</template>
				<br />
				<HTMLButton type="submit"> Actualizar repositorio </HTMLButton>
			</HTMLForm>

			<div class="Repository__content--delete">
				<article>
					<div>
						<h3>
							<i class="fa-solid fa-trash-can"></i> Eliminar
							repositorio
						</h3>
						<p>
							Esta acci&oacute;n eliminar&aacute; todos los
							recursos contenidos del repositorio. No tiene
							retorno.
						</p>
					</div>
					<HTMLButton type="button" :click="deleteRepository">
						Eliminar
					</HTMLButton>
				</article>
			</div>
		</section>
		<!-- Modals -->
		<Modal v-model:opened="modalTag">
			<template #title>
				<h2>Añadir etiqueta</h2>
			</template>
			<HTMLForm :action="() => addToCustomArray('tags', tagName)">
				<HTMLInput
					v-model:value="tagName"
					label-text="Etiqueta"
					field="tag"
				/>
				<HTMLButton type="submit"> Añadir etiqueta </HTMLButton>
			</HTMLForm>
		</Modal>
	</HTMLContainer>
</template>

<style scoped lang="scss">
.Repository__body--content {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

a {
	text-decoration: none;
	color: var(--color-main);
}

button i {
	color: var(--color-bg);
}

.Repository__confg--input {
	display: flex;
	width: 100%;
	justify-content: space-evenly;
	align-items: center;
	gap: 20px;
	article {
		width: 100%;
	}
	button {
		height: 30px;
		width: 100%;
		max-width: 140px;
	}
}

.Repository__confg--list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	div {
		display: flex;
		gap: 8px;
		background-color: var(--color-bg);
		padding: 5px;
		border-radius: 5px;
		align-items: center;
	}
	button i {
		color: white;
		transition: all 0.4s;
	}
	:hover button i {
		color: var(--color-main);
	}
}

.Repository__content--delete {
	border: 1px solid var(--color-danger);
	border-radius: 5px;
	padding: 10px;
	display: flex;
	flex-direction: column;
	article {
		display: flex;
		font-size: 0.9rem;
		button {
			font-size: 0.8rem;
		}
		justify-content: space-between;
	}
}
</style>
