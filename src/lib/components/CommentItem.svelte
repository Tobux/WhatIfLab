<script lang="ts">
	let {
		selectedText,
		commentText,
		onEdit,
		onRemove
	}: {
		selectedText: string;
		commentText: string;
		onEdit: () => void;
		onRemove: () => void;
	} = $props();
</script>

<div class="card bg-base-200 shadow-sm">
	<div class="card-body p-3">
		<div class="flex items-start justify-between gap-2">
			<div class="min-w-0 flex-1">
				<p class="mb-1 text-xs font-semibold break-words text-base-content/70">
					"{selectedText}"
				</p>
				<p class="text-sm break-words">{commentText}</p>
			</div>
			<div class="flex shrink-0 gap-1">
				<button class="btn btn-ghost btn-xs" onclick={onEdit} aria-label="Edit comment">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
						/>
					</svg>
				</button>
				<button class="btn btn-ghost btn-xs" onclick={onRemove} aria-label="Remove comment">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-4 w-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M6 18L18 6M6 6l12 12"
						/>
					</svg>
				</button>
			</div>
		</div>
	</div>
</div>
