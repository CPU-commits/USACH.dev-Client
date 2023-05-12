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
				<NuxtLink to="/repositories"> Repositorios </NuxtLink>
				<NuxtLink to="/discussions"> Discusiones </NuxtLink>
				<NuxtLink to="/repositories"> Uso </NuxtLink>
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
</style>
