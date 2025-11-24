<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>WhatIfLab</title>
</svelte:head>

<div class="flex min-h-screen flex-col bg-base-200">
	<nav class="navbar bg-base-100 px-4 shadow-sm">
		<div class="flex-1">
			<a href="/" class="btn text-xl btn-ghost">WhatIfLab</a>
		</div>
		<div class="flex-none gap-2">
			<button class="btn btn-outline btn-sm"> Quickstart Guide </button>
		</div>
	</nav>

	<main class="max-w-7xl container mx-auto flex-1 p-4">
		{@render children()}
	</main>
</div>
