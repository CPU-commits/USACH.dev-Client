<script setup lang="ts">
// Stores
const authStore = useAuthStore()

const isTop = ref(true)

onMounted(() => {
	document.addEventListener('scroll', () => {
		if (window.scrollY > 0) isTop.value = false
		else isTop.value = true
	})
})
</script>

<template>
	<header :class="{ 'Header-init': isTop }" class="Header">
		<div class="Header__logo">
			<NuxtLink to="/">
				<h1>🦁 USACH.dev</h1>
			</NuxtLink>
			<nav class="Header__nav">
				<NuxtLink to="/repositories">
					<span>Repositorios</span>
					<i class="fa-solid fa-boxes-stacked"></i>
				</NuxtLink>
				<NuxtLink to="/discussions">
					<span>Discusiones</span>
					<i class="fa-solid fa-users-between-lines"></i>
				</NuxtLink>
				<NuxtLink to="/repositories">
					<span>Uso</span>
				</NuxtLink>
			</nav>
		</div>
		<div class="Header__user">
			<NuxtLink
				:to="`/${
					authStore.isAuth ? authStore.getUsername ?? '' : 'session'
				}`"
				class="Impact"
			>
				<i class="fa-solid fa-user-astronaut"></i>
			</NuxtLink>
			<NuxtLink to="/manifest" class="Impact">
				<i class="fa-regular fa-message"></i>
			</NuxtLink>
		</div>
	</header>
</template>

<style lang="scss" scoped>
.Header {
	padding: 15px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 9999;
	background-color: var(--color-bg);
	transition: all 0.4s ease;
}

.Header-init {
	background-color: var(--color-main);
	.Header__logo {
		h1 {
			color: var(--color-bg);
		}
		a {
			color: var(--color-bg);
		}
		a:hover {
			color: var(--color-text);
		}
	}
	.Header__nav {
		a {
			i,
			span {
				color: var(--color-bg);
			}
		}
	}
	.Impact {
		i {
			color: var(--color-text);
			background-color: var(--color-bg);
		}
	}
}

.Header__logo {
	display: flex;
	align-items: center;
	gap: 30px;
	a {
		text-decoration: none;
	}
	h1 {
		font-size: 1.4rem;
	}
}

.Header__nav {
	display: flex;
	gap: 50px;
	a {
		text-decoration: none;
		transition: all 0.4s ease;
		font-weight: bold;
		i {
			color: white;
			display: none;
		}
		span {
			color: white;
		}
	}
	a:hover {
		color: var(--color-main);
	}
}

.Header__user {
	display: flex;
	gap: 10px;
}

.Impact {
	i {
		transition: all 0.2s ease;
		background-color: var(--color-main);
		padding: 10px;
		border-radius: 80%;
		color: var(--color-bg);
	}
}

.Impact:hover i {
	transform: rotate(10deg) scale(1.2);
}

@media (max-width: 767.98px) {
	a {
		font-size: 0.9rem;
	}

	.Header__nav {
		gap: 30px;
	}

	.Header__logo {
		h1 {
			font-size: 1.3rem;
		}
	}
}

@media (max-width: 575.98px) {
	a {
		font-size: 0.8rem;
	}

	.Header__nav {
		gap: 20px;
		span {
			display: none;
		}
		a {
			i {
				display: block;
				font-size: 1rem;
			}
		}
	}

	.Header__logo {
		h1 {
			font-size: 1.2rem;
		}
	}
}
</style>
