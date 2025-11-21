<script lang="ts">
	interface Stats {
		time: number;
		tokens: number;
	}

	let { stats = $bindable({ time: 0, tokens: 0 }) }: { stats?: Stats } = $props();
</script>

<div class="card bg-base-100 shadow-sm">
	<div class="card-body p-3">
		<div class="flex items-center gap-4">
			<h2 class="text-sm font-semibold text-base-content/70">Output Statistics</h2>
			<div class="flex flex-1 items-center gap-3">
				<div class="tooltip" data-tip="Processing time in seconds">
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-primary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span class="text-sm font-medium">{stats.time}s</span>
					</div>
				</div>
				<div class="tooltip" data-tip="Total tokens generated">
					<div class="flex items-center gap-2 rounded-lg bg-base-200 px-3 py-1.5">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-4 w-4 text-secondary"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
							/>
						</svg>
						<span class="text-sm font-medium">{stats.tokens}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
