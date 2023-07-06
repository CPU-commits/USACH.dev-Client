<script lang="ts" setup>
import { Editor } from '@tiptap/core'
import { Repository } from '~~/models/repository/repo.model'
import { Like } from '@/models/repository/like.model'
import { LinkType } from '@/models/repository/link.model'

// Nuxt app
const { $repoService, $fetchModule } = useNuxtApp()
// Stores
const authStore = useAuthStore()
const toastsStore = useToastsStore()
// Route
const route = useRoute()

const username = route.params.user
const repoName = route.params.repo

// Modals
const modalLink = ref(false)

const toggleModalLink = () => (modalLink.value = !modalLink.value)
// Form
const newLink = ref({
	type: '' as keyof typeof LinkType,
	title: '',
	link: '',
})
// Data
const repository = ref<null | Repository>(null)
const like = ref<null | Like>(null)
const editor = ref<null | Editor>(null)
const isOwner = ref(false)
const readOnly = ref(true)

onMounted(async () => {
	const dataFetch = await $repoService.getRepo({
		username: username as string,
		repository: repoName as string,
	})
	repository.value = dataFetch.repository
	like.value = dataFetch.like
	if (!repository.value.system_file) repository.value.system_file = []

	// Set isOwner
	isOwner.value = authStore.getUsername === repository.value?.owner.username
})

async function downloadRepo() {
	try {
		await $repoService.download(repository.value?._id ?? '')
	} catch (err) {
		toastsStore.addToast({
			message: 'No se ha podido descargar el archivo',
			type: 'error',
		})
	}
}

function toggleLike(isPlus: boolean) {
	// Update stars
	if (repository.value && like.value)
		repository.value.stars += isPlus ? 2 : -2
	else if (repository.value) repository.value.stars += isPlus ? 1 : -1
	// Update like
	if (like.value) {
		like.value.plus = isPlus
	} else {
		like.value = {
			_id: '',
			date: '',
			plus: isPlus,
			repository: '',
			user: '',
		}
	}
}

async function toggleLikeRepo(isPlus: boolean) {
	if (!authStore.isAuth)
		toastsStore.addToast({
			message: 'Inicia sesión para puntuar el repositorio',
			type: 'error',
		})
	else
		try {
			await $repoService.toggleLike(repository.value?._id ?? '', isPlus)
			toggleLike(isPlus)
		} catch (err) {
			toastsStore.addToast({
				message: 'Ha ocurrido un error',
				type: 'error',
			})
		}
}

async function updateContent() {
	try {
		await $repoService.updateRepository(repository.value?._id ?? '', {
			content: editor.value?.getHTML(),
		})
		toastsStore.addToast({
			message: 'Se ha actualizado el contenido exitosamente',
			type: 'success',
		})
	} catch (err) {
		toastsStore.addToast({
			message: 'Ha ocurrido un error al actualizar el contenido',
			type: 'error',
		})
	}
}

async function addLink() {
	try {
		const _id = await $repoService.addLink(
			repository.value?._id ?? '',
			newLink.value,
		)
		// Add link
		if (repository.value && !repository.value?.links)
			repository.value.links = []
		repository.value?.links?.push({
			_id,
			...newLink.value,
		})
		// Close modal
		toggleModalLink()
		newLink.value = {
			link: '',
			title: '',
			type: '' as keyof typeof LinkType,
		}
	} catch (err) {
		const error = $fetchModule.handleError(err)
		toastsStore.addToast({
			message: error.message,
			type: 'error',
		})
	}
}

async function deleteLink(idLink: string) {
	try {
		await $repoService.deleteLink(idLink, repository.value?._id ?? '')
		// Delete link
		if (repository.value?.links)
			repository.value.links = repository.value?.links.filter(
				(link) => link._id !== idLink,
			)
	} catch (err) {
		toastsStore.addToast({
			message: 'No se pudo eliminar el enlace',
			type: 'error',
		})
	}
}
</script>

<template>
	<HTMLContainer class="Repository" orientation="V" :gap="10">
		<RepoNav
			v-if="repository"
			:is-owner="isOwner"
			:owner="repository.owner.username"
			:repo-name="repository.name"
		/>
		<div v-if="repository" class="Repository__body">
			<section class="Repository__body--content">
				<h2>
					{{ repository.name }} -
					<NuxtLink :to="`/${repository.owner.username}`">
						{{ repository.owner.full_name }} &lt;{{
							repository.owner.username
						}}>
					</NuxtLink>
				</h2>
				<header>
					<HTMLButton type="button" :click="downloadRepo">
						<i class="fa-solid fa-download" />
						Descargar repositorio
					</HTMLButton>
				</header>
				<RepoSystemFile
					:is-owner="isOwner"
					:id-repository="repository._id"
					:repo-name="repository.name"
					:system-file="repository.system_file ?? []"
					@new-element="(el) => repository?.system_file?.push(el)"
					@delete-element="
						(idEl) => {
							if (repository?.system_file)
								repository.system_file =
									repository?.system_file?.filter(
										(el) => el._id !== idEl,
									)
						}
					"
				/>
				<ClientOnly>
					<section class="Repository__content--body">
						<aside v-if="isOwner">
							<HTMLSimpleButton
								:click="() => (readOnly = !readOnly)"
							>
								<i v-if="readOnly" class="fa-solid fa-pen"></i>
								<i v-else class="fa-solid fa-xmark"></i>
							</HTMLSimpleButton>
						</aside>
						<HTMLRich
							:have-background="false"
							:body="repository.content ?? ''"
							:read-only="!isOwner || readOnly"
							@build-editor="(e) => (editor = e)"
						/>
					</section>
				</ClientOnly>
				<HTMLButton
					v-if="!readOnly"
					type="button"
					:click="updateContent"
				>
					Actualizar contenido
				</HTMLButton>
			</section>
			<aside class="Repository__body--float">
				<header>
					<p>{{ repository?.description ?? 'Sin descripción' }}</p>
					<ul>
						<li>
							<i class="fa-solid fa-download"></i>
							{{ repository.downloads }} Descargas
						</li>
						<li class="Alink">
							<span
								class="material-symbols-outlined"
								:class="{ Selected: like !== null }"
							>
								temp_preferences_custom
							</span>
							<aside class="Repository__float--stars">
								<HTMLSimpleButton
									:click="() => toggleLikeRepo(true)"
									:class="{
										Selected: like !== null && like.plus,
									}"
								>
									<i class="fa-solid fa-plus"></i>
								</HTMLSimpleButton>
								<HTMLSimpleButton
									:click="() => toggleLikeRepo(false)"
									:class="{
										Selected: like !== null && !like.plus,
									}"
								>
									<i class="fa-solid fa-minus"></i>
								</HTMLSimpleButton>
							</aside>
							{{ repository.stars }} Polvos
						</li>
						<li>
							<i class="fa-solid fa-eye"></i>
							{{ repository.views }} Vistas
						</li>
					</ul>
				</header>
				<section class="Repository__float--links">
					<RepoLink
						v-for="link in repository.links"
						:key="link._id"
						:link="link"
						:is-owner="isOwner"
						@delete="(_id) => deleteLink(_id)"
					/>
					<HTMLButton
						v-if="isOwner"
						type="button"
						:click="toggleModalLink"
					>
						<i class="fa-solid fa-arrow-up-right-from-square"></i>
						Añadir enlace
					</HTMLButton>
				</section>
				<footer>
					<small v-if="repository.stars <= -5">
						<i class="fa-solid fa-skull-crossbones" />
						Repositorio en riesgo de eliminaci&oacute;n...
					</small>
					<small>
						Creado {{ formatDate(repository.created_date) }}
					</small>
					<small
						v-if="
							datesAreDifferents(
								repository.created_date,
								repository.updated_date,
							)
						"
					>
						&Uacute;ltima actualizaci&oacute;n
						{{ formatDate(repository.updated_date) }}
					</small>
					<small class="Tags">
						<NuxtLink
							v-for="tag in repository.tags"
							:key="tag"
							class="Tag"
							:to="`/repositories?search=${tag}`"
						>
							#{{ tag }}
						</NuxtLink>
					</small>
				</footer>
			</aside>
		</div>
		<!-- Modals -->
		<Modal v-model:opened="modalLink">
			<template #title>
				<h2>Añadir enlace</h2>
			</template>
			<HTMLForm :action="addLink">
				<HTMLSelect
					v-model:value="newLink.type"
					label-text="Tipo de enlace"
					field="type"
				>
					<option value="">Selecciona una opci&oacute;n</option>
					<option value="drive">Drive</option>
					<option value="github">Github</option>
					<option value="cloud">Nube</option>
					<option value="pdf">PDF</option>
					<option value="youtube">Youtube</option>
					<option value="other">Otro</option>
				</HTMLSelect>
				<HTMLInput
					v-model:value="newLink.title"
					label-text="Titulo"
					field="title"
				/>
				<HTMLInput
					v-model:value="newLink.link"
					label-text="Enlace"
					field="link"
				/>
				<HTMLButton type="submit">Añadir</HTMLButton>
			</HTMLForm>
		</Modal>
	</HTMLContainer>
</template>

<style scoped lang="scss">
.Repository__body {
	display: grid;
	grid-template-columns: 1fr 200px;
	gap: 20px;
}

.Repository__body--content {
	display: flex;
	flex-direction: column;
	gap: 15px;
}

.Repository__content--body {
	position: relative;
	aside {
		position: absolute;
		right: 0;
		width: fit-content;
		z-index: 9;
		i {
			color: white;
		}
		padding: 10px;
	}
}

.Repository__body--float {
	position: sticky;
	top: 70px;
	padding: 5px;
	height: fit-content;
	border-radius: 5px;
	font-size: 0.9rem;
	header {
		border-bottom: 1px solid;
		padding-bottom: 10px;
	}
}

ul {
	margin-top: 20px;
	position: relative;
}

li {
	display: flex;
	align-items: center;
	gap: 20px;
	i,
	span {
		width: 20px;
	}
}

footer {
	padding-top: 10px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	small {
		font-size: 0.6rem;
	}
}

button i {
	color: var(--color-bg);
}

a {
	text-decoration: none;
	color: var(--color-main);
}

span {
	transition: all 0.4s ease;
}

.Alink:hover span {
	color: var(--color-main);
}

.Alink:hover .Repository__float--stars {
	display: flex;
}

.Selected,
.Selected i {
	color: var(--color-main);
}

.Repository__float--stars {
	position: absolute;
	background-color: white;
	border-radius: 3px;
	padding: 5px;
	bottom: -9px;
	display: none;
	gap: 10px;
	left: -18px;
	transition: all 0.4s;
	i {
		transition: all 0.4s;
	}
	:hover i {
		color: var(--color-main);
	}
}

.Repository__float--links {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
	padding: 10px 0;
	button {
		padding: 5px;
		font-size: 0.8rem;
		align-self: center;
	}
	border-bottom: 1px solid;
}

.Tags {
	display: flex;
	gap: 5px;
	.Tag {
		background-color: var(--color-console);
		padding: 5px;
		border-radius: 3px;
	}
}
</style>
