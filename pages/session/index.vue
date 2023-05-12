<script setup lang="ts">
// NuxtApp
const { $authService } = useNuxtApp()
// Stores
const tostStore = useToastsStore()
const authStore = useAuthStore()
// Router
const route = useRoute()

// Data
const form = {
	full_name: '',
	email: '',
	password: '',
	confirm_password: '',
}
const isRegister = ref(route.query.confirm !== 'true')

onMounted(() => {
	if (route.query.confirm === 'true')
		tostStore.addToast({
			message: '¡Has confirmado tu cuenta! Inicia sesión para comenzar.',
			type: 'success',
		})
})
</script>

<template>
	<section class="User">
		<div class="User__container fade-in-bck">
			<HTMLForm
				:action="
					() => {
						if (isRegister) $authService.register(form)
						else
							authStore.logIn({
								password: form.password,
								email: form.email,
							})
					}
				"
			>
				<h2>{{ isRegister ? 'Registrarse' : 'Iniciar sesión' }}</h2>
				<HTMLInput
					v-if="isRegister"
					v-model:value="form.full_name"
					label-text="Nombre completo"
					field="full_name"
				/>
				<HTMLInput
					v-model:value="form.email"
					label-text="Email"
					field="email"
				/>
				<HTMLInput
					v-model:value="form.password"
					type="password"
					label-text="Contraseña"
					field="password"
				/>
				<HTMLInput
					v-if="isRegister"
					v-model:value="form.confirm_password"
					type="password"
					label-text="Confirmar contraseña"
					field="confirm_password"
				/>
				<HTMLButton type="submit"> Env&iacute;ar </HTMLButton>
				<footer class="Footer">
					<button
						type="button"
						class="Footer__button"
						@click="() => (isRegister = !isRegister)"
					>
						¿Tienes una sesi&oacute;n?
					</button>
					<button type="button" class="Footer__button">
						Recuperar contraseña
					</button>
				</footer>
			</HTMLForm>
		</div>
	</section>
</template>

<style lang="scss" scoped>
.User {
	padding: 30px;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	align-items: center;
	.User__container {
		max-width: 500px;
		width: 100%;
	}
}

h2 {
	color: var(--color-main);
	border-bottom: 1px solid var(--color-text);
	padding: 2px;
	margin-bottom: 5px;
}

.fade-in-bck {
	-webkit-animation: fade-in-bck 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
	animation: fade-in-bck 0.6s cubic-bezier(0.39, 0.575, 0.565, 1) both;
}

@-webkit-keyframes fade-in-bck {
	0% {
		-webkit-transform: translateZ(80px);
		transform: translateZ(80px);
		opacity: 0;
	}
	100% {
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
		opacity: 1;
	}
}
@keyframes fade-in-bck {
	0% {
		-webkit-transform: translateZ(80px);
		transform: translateZ(80px);
		opacity: 0;
	}
	100% {
		-webkit-transform: translateZ(0);
		transform: translateZ(0);
		opacity: 1;
	}
}

.Footer {
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.Footer__button {
	background-color: transparent;
	border: none;
	transition: all 0.4s ease;
}

.Footer__button:hover {
	color: var(--color-main);
}
</style>
