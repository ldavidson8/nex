<script lang="ts">
	import { getTypeIcon } from '$lib/utils/getTypeIcon';
	import { getTypeColor } from '$lib/utils/getTypeColor';
	import { cn } from '$lib/utils';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import Seo from '$lib/components/Seo.svelte';
	import { PokemonTypes as types } from '$lib/types';
	import { getEffectiveness } from '$lib/utils/getEffectiveness';

	function getCellDisplay(value: number) {
		if (value === 2) return { text: '2', class: 'bg-green-700 text-white font-medium text-xs' };
		if (value === 0.5) return { text: '½', class: 'bg-red-500 text-white font-medium text-xs' };
		if (value === 0) return { text: '0', class: 'bg-black text-white font-medium text-xs' };
		return { text: '', class: '' };
	}
</script>

<Seo title="Types - Nex" description="Complete Pokémon type effectiveness matrix." />

<div class="container mx-auto px-4 py-12">
	<div class="mb-8 space-y-2">
		<h1 class="text-4xl font-bold tracking-tight">Type Chart</h1>
		<p class="text-muted-foreground text-lg">Relationships between Pokémon types.</p>
	</div>

	<div class="overflow-hidden rounded-xl border">
		<div class="overflow-x-auto">
			<Tooltip.Provider>
				<table class="w-full border-collapse">
					<thead>
						<tr>
							<th class="bg-muted/50 sticky left-0 z-30 min-w-[120px] border-r border-b p-0">
								<div
									class="relative h-20 w-full bg-[linear-gradient(to_top_right,transparent_calc(50%-0.5px),var(--color-border)_50%,transparent_calc(50%+0.5px))]"
								>
									<span
										class="text-muted-foreground absolute top-2 right-2 text-[10px] font-bold tracking-wider uppercase"
									>
										Defender
									</span>
									<span
										class="text-muted-foreground absolute bottom-2 left-2 text-[10px] font-bold tracking-wider uppercase"
									>
										Attacker
									</span>
								</div>
							</th>

							{#each types as type (type)}
								{@const ColumnIcon = getTypeIcon(type)}
								<th class="bg-muted/30 min-w-[44px] border-b p-2">
									<div class="flex flex-col items-center gap-3">
										<div
											class={cn(
												'grid size-7 place-items-center rounded-full text-white shadow-sm',
												getTypeColor(type)
											)}
										>
											{#if ColumnIcon}<ColumnIcon class="size-4" />{/if}
										</div>

										<span
											class="rotate-180 text-[10px] font-bold tracking-tight uppercase [writing-mode:vertical-rl]"
										>
											{type}
										</span>
									</div>
								</th>
							{/each}
						</tr>
					</thead>
					<tbody>
						{#each types as attacker (attacker)}
							{@const RowIcon = getTypeIcon(attacker)}
							<tr class="hover:bg-muted/5 transition-colors">
								<td
									class="bg-background sticky left-0 z-20 border-r p-1 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"
								>
									<div class="flex items-center gap-2 px-2 py-1">
										<div
											class={cn(
												'grid size-8 shrink-0 place-items-center rounded-md text-white shadow-sm',
												getTypeColor(attacker)
											)}
										>
											{#if RowIcon}<RowIcon class="size-5" />{/if}
										</div>
										<span class="text-xs font-bold capitalize">{attacker}</span>
									</div>
								</td>
								{#each types as defender (defender)}
									{@const effectiveness = getEffectiveness(attacker, defender)}
									{@const display = getCellDisplay(effectiveness)}
									<td
										class={cn(
											'border-muted/50 border p-0 text-center transition-colors',
											display.class
										)}
									>
										{#if effectiveness !== 1}
											<Tooltip.Root delayDuration={100}>
												<Tooltip.Trigger
													class="flex h-11 w-full items-center justify-center transition-opacity hover:opacity-80"
												>
													{display.text}
												</Tooltip.Trigger>
												<Tooltip.Content side="top">
													<p>
														<span class="font-semibold capitalize">{attacker}</span> →
														<span class="font-semibold capitalize">{defender}</span>:
														<span class="underline">{effectiveness}x</span>
													</p>
												</Tooltip.Content>
											</Tooltip.Root>
										{:else}
											<div class="h-11 w-full"></div>
										{/if}
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</Tooltip.Provider>
		</div>
	</div>

	<div class="mt-8 flex flex-wrap gap-4">
		<div class="bg-card flex items-center gap-3 rounded-lg border px-4 py-2 shadow-sm">
			<div class="grid size-6 place-items-center rounded bg-green-500 text-xs font-bold text-white">
				2
			</div>
			<span class="text-xs font-medium tracking-wide uppercase">Super Effective</span>
		</div>
		<div class="bg-card flex items-center gap-3 rounded-lg border px-4 py-2 shadow-sm">
			<div class="grid size-6 place-items-center rounded bg-red-500 text-xs font-bold text-white">
				½
			</div>
			<span class="text-xs font-medium tracking-wide uppercase">Not Very Effective</span>
		</div>
		<div class="bg-card flex items-center gap-3 rounded-lg border px-4 py-2 shadow-sm">
			<div class="grid size-6 place-items-center rounded bg-black text-xs font-bold text-white">
				0
			</div>
			<span class="text-xs font-medium tracking-wide uppercase">No Effect</span>
		</div>
	</div>
</div>
