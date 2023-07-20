<script lang="ts" setup>
// Types
import type { ErrorFetch } from '~~/common/fetchModule'
import type { User } from '~~/models/user/user.model'
import type { Repository } from '~~/models/repository/repo.model'
// NuxtApp
const { $userService, $fetchModule, $repoService } = useNuxtApp()
// Stores
const tostsStore = useToastsStore()
const authStore = useAuthStore()
// Router
const route = useRoute()

const username = route.params.user as string
// Data
const user = ref<User | null>(null)
const repositories = ref<Array<Repository> | null>(null)
const error = ref<ErrorFetch | null>(null)

onMounted(async () => {
	try {
		// Fetch data
		const data = await Promise.all([
			$userService.getUser(username ?? '', true),
			$repoService.getUserRepos(username ?? ''),
		])
		user.value = data[0]
		repositories.value = data[1]
	} catch (err) {
		error.value = $fetchModule.handleError(err)

		tostsStore.addToast({
			message: 'Ha ocurrido un error',
			type: 'error',
		})
	}
})
</script>

<template>
	<HTMLContainer v-if="user" class="User">
		<div class="User__profile">
			<header>
				<UserAvatar
					:src="
						user?.profile?.avatar
							? $userService.getAvatar(user.username)
							: 'default'
					"
					:editable="true"
					@image="
						(image) =>
							$userService.updateProfile({
								avatar: image,
							})
					"
				/>
				<div>
					<h3>{{ user.full_name }}</h3>
					<h4>@{{ user.username }}</h4>
				</div>
			</header>
			<p>
				<HTMLTextArea
					:input-style="false"
					:value="
						user?.profile
							? user.profile.description
							: 'No hay descripción'
					"
					:action-after="{
						action: (text) =>
							$userService.updateProfile({
								description: text,
							}),
						timeInSeconds: 0.5,
					}"
				/>
			</p>
		</div>
		<div class="User__repositories">
			<header>
				<h2>Repositorios</h2>
				<HTMLAButton
					v-if="authStore.getUsername === user.username"
					href="/new"
				>
					<i class="fa-solid fa-book"></i> Añadir
				</HTMLAButton>
			</header>
			<section
				v-if="repositories && repositories.length > 0"
				class="User__repositories--cards"
			>
				<RepoCard
					v-for="repository in repositories"
					:key="repository._id"
					:repository="repository"
					:owner="username"
				/>
			</section>
			<div
				v-else-if="repositories?.length === 0"
				class="User__repositories--404"
			>
				<img class="User__repositories--notfound" src="/img/repo.svg" />
				<span>
					Todav&iacute;a no ha publicado repositorios este usuario
				</span>
			</div>
		</div>
	</HTMLContainer>
</template>

<style scoped lang="scss">
.User {
	.User__repositories--404 {
		display: flex;
		flex-direction: column;
		align-items: center;
		span {
			font-weight: bold;
			font-size: 1.7rem;
			text-align: center;
		}
	}
	.User__repositories--notfound {
		width: 100%;
	}
}

.User__profile {
	border-bottom: 1px solid white;
	padding-bottom: 20px;
	min-width: 250px;
	height: fit-content;
}

.User__profile header {
	display: flex;
	gap: 10px;
	align-items: center;
	position: sticky;
	top: 20px;
	h3 {
		font-weight: bold;
	}
	margin-bottom: 20px;
}

i {
	color: var(--color-black);
}

.User__repositories {
	width: 100%;
}

.User__repositories--cards {
	margin-top: 10px;
	display: flex;
	flex-direction: column;
	gap: 15px;
	background-color: var(--color-console);
	padding: 15px;
	border-radius: 8px;
}

.User__repositories header {
	display: flex;
	justify-content: space-between;
}

@media (max-width: 767.98px) {
	.User__repositories--cards {
		padding: 0;
	}
}
</style>
