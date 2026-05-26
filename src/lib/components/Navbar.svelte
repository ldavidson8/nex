<script lang="ts">
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import MenuIcon from "@lucide/svelte/icons/menu";
	import SearchIcon from "@lucide/svelte/icons/search";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import * as Navigation from "$lib/components/navigation";
	import { POKEMON_COLOURS } from "$lib/constants";

	const stats = [
		["HP", 78, "bg-pkmn-grass"],
		["ATK", 84, "bg-pkmn-fire"],
		["DEF", 78, "bg-pkmn-water"],
		["SPD", 100, "bg-pkmn-electric"],
	];

	const types = ["fire", "water", "grass", "electric", "psychic", "dragon"] as const;
	const pokemon = ["Bulbasaur", "Charizard", "Squirtle", "Pikachu", "Mewtwo", "Dragonite"];

	function activeKey(key: string | null, fallback: string) {
		return key ?? fallback;
	}
</script>

<header class="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
		<a href="/" class="flex items-center gap-2 font-black tracking-tight text-primary">
			<span
				class="grid size-9 place-items-center rounded-lg bg-primary text-[13px] font-black text-primary-foreground"
				aria-hidden="true"
			>
				NX
			</span>
			<span class="text-lg">Nex</span>
		</a>

		<div class="relative ml-2 hidden flex-1 lg:block">
			<Navigation.Root>
				<Navigation.Trigger id="pokedex" href="/pokemon">Pokédex</Navigation.Trigger>
				<Navigation.Trigger id="data" href="/types">Data</Navigation.Trigger>
				<Navigation.Trigger id="tools">Tools</Navigation.Trigger>
				<Navigation.Trigger id="community">Community</Navigation.Trigger>
				<Navigation.Link href="/pricing">Pricing</Navigation.Link>
				<Navigation.Link href="/news">News</Navigation.Link>

				<Navigation.Dropdown>
					<Navigation.Content
						triggerId="pokedex"
						sidebar={pokedexSidebar}
						preview={pokedexPreview}
					/>
					<Navigation.Content
						triggerId="data"
						sidebar={dataSidebar}
						preview={dataPreview}
						footer={dataFooter}
					/>
					<Navigation.Content triggerId="tools" sidebar={toolsSidebar} preview={toolsPreview} />
					<Navigation.Content
						triggerId="community"
						sidebar={communitySidebar}
						preview={communityPreview}
					/>
				</Navigation.Dropdown>
			</Navigation.Root>
		</div>

		<div class="hidden items-center gap-2 lg:flex">
			<a
				href="/pokemon"
				class="inline-flex h-9 items-center gap-2 rounded-full border border-border bg-background px-4 text-sm font-semibold text-primary transition-colors hover:bg-accent"
			>
				<SearchIcon class="size-4" aria-hidden="true" />
				Search
			</a>
			<a
				href="/pokemon"
				class="inline-flex h-9 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
			>
				Explore
				<ArrowRightIcon class="size-4" aria-hidden="true" />
			</a>
		</div>

		<button
			type="button"
			class="inline-flex size-10 items-center justify-center rounded-full border border-border text-primary lg:hidden"
			aria-label="Open navigation"
		>
			<MenuIcon class="size-5" aria-hidden="true" />
		</button>
	</div>
</header>

{#snippet pokedexSidebar()}
	<Navigation.Item previewKey="national" href="/pokemon">
		National Dex
		{#snippet description()}Browse every discovered Pokémon entry.{/snippet}
	</Navigation.Item>
	<Navigation.Item previewKey="search" href="/pokemon">
		Search Pokémon
		{#snippet description()}Find by name, number, ability, or type.{/snippet}
	</Navigation.Item>
	<Navigation.Item previewKey="types" href="/types">
		Filter by Type
		{#snippet description()}Compare matchups and type coverage.{/snippet}
	</Navigation.Item>
	<Navigation.Item previewKey="stats" href="/pokemon">
		Base Stats
		{#snippet description()}Scan strengths before building a team.{/snippet}
	</Navigation.Item>
	<Navigation.Item previewKey="abilities" href="/abilities">
		Abilities
		{#snippet description()}Discover passive effects and synergies.{/snippet}
	</Navigation.Item>
{/snippet}

{#snippet dataSidebar()}
	<Navigation.Item previewKey="items" href="/items">Items</Navigation.Item>
	<Navigation.Item previewKey="moves" href="/moves">Moves</Navigation.Item>
	<Navigation.Item previewKey="abilities" href="/abilities">Abilities</Navigation.Item>
	<Navigation.Item previewKey="types" href="/types">Types</Navigation.Item>
{/snippet}

{#snippet toolsSidebar()}
	<Navigation.Item previewKey="team" href="/tools/team-builder">Team Builder</Navigation.Item>
	<Navigation.Item previewKey="tcg" href="/tools/tcg-tracker">TCG Tracker</Navigation.Item>
	<Navigation.Item previewKey="quiz" href="/tools/quiz">Quiz</Navigation.Item>
	<Navigation.Item previewKey="iv" href="/tools/iv-calculator">IV Calculator</Navigation.Item>
	<Navigation.Item previewKey="damage" href="/tools/damage-calculator">Damage Calc</Navigation.Item>
{/snippet}

{#snippet communitySidebar()}
	<Navigation.Item previewKey="forums" href="/community/forums">Forums</Navigation.Item>
	<Navigation.Item previewKey="events" href="/community/events">Events</Navigation.Item>
	<Navigation.Item previewKey="tournaments" href="/community/tournaments"
		>Tournaments</Navigation.Item
	>
{/snippet}

{#snippet dataFooter()}
	<a
		href="/types"
		class="flex items-center justify-between px-3 py-2 text-xs font-semibold text-primary/60 transition-colors hover:text-primary"
	>
		Explore all datasets
		<ArrowRightIcon class="size-3" aria-hidden="true" />
	</a>
{/snippet}

{#snippet pokedexPreview(key: string | null)}
	{@const selected = activeKey(key, "national")}
	<div class="h-full rounded-lg bg-primary/3 p-5">
		<div class="mb-4 flex items-center justify-between">
			<div>
				<p class="text-xs font-bold text-primary/45 uppercase">Pokédex</p>
				<h2 class="text-xl font-black capitalize">{selected.replace("-", " ")}</h2>
			</div>
			<span class="rounded-full bg-pkmn-electric px-3 py-1 text-xs font-black text-primary"
				>Live</span
			>
		</div>
		<div class="grid grid-cols-3 gap-2">
			{#each pokemon as name, index (name)}
				<div class="rounded-lg border border-border/60 bg-background p-3">
					<div class="mb-2 aspect-square rounded-md bg-primary/4"></div>
					<p class="truncate text-xs font-bold">{name}</p>
					<p class="text-[10px] text-primary/45">#{String(index + 1).padStart(3, "0")}</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet dataPreview(key: string | null)}
	{@const selected = activeKey(key, "items")}
	<div class="h-full rounded-lg bg-primary/3 p-5">
		<p class="mb-1 text-xs font-bold text-primary/45 uppercase">Data Browser</p>
		<h2 class="mb-5 text-xl font-black capitalize">{selected}</h2>
		<div class="grid grid-cols-2 gap-3">
			{#each types as type (type)}
				<div class="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
					<span class={`size-3 rounded-full ${POKEMON_COLOURS[type]}`}></span>
					<span class="text-sm font-bold capitalize">{type}</span>
				</div>
			{/each}
		</div>
		<div class="mt-4 rounded-lg border border-border/60 bg-background p-4">
			{#each stats as [label, value, color] (label)}
				<div class="mb-3 last:mb-0">
					<div class="mb-1 flex justify-between text-xs font-bold">
						<span>{label}</span>
						<span>{value}</span>
					</div>
					<div class="h-2 overflow-hidden rounded-full bg-muted">
						<div class={`h-full rounded-full ${color}`} style:width={`${value}%`}></div>
					</div>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet toolsPreview(key: string | null)}
	{@const selected = activeKey(key, "team")}
	<div class="h-full rounded-lg bg-primary/3 p-5">
		<div class="mb-5 flex items-center gap-3">
			<div class="grid size-10 place-items-center rounded-lg bg-pkmn-psychic text-white">
				<SparklesIcon class="size-5" aria-hidden="true" />
			</div>
			<div>
				<p class="text-xs font-bold text-primary/45 uppercase">Toolkit</p>
				<h2 class="text-xl font-black capitalize">{selected.replace("-", " ")}</h2>
			</div>
		</div>
		<div class="grid grid-cols-3 gap-2">
			{#each ["Fire", "Water", "Grass", "Electric", "Steel", "Fairy"] as type (type)}
				<div
					class="grid aspect-square place-items-center rounded-lg border border-border/60 bg-background text-xs font-black"
				>
					{type}
				</div>
			{/each}
		</div>
		<div class="mt-4 rounded-lg bg-background p-4 text-sm font-semibold text-primary/70">
			Plan coverage, compare damage ranges, and save team ideas in one compact workspace.
		</div>
	</div>
{/snippet}

{#snippet communityPreview(key: string | null)}
	{@const selected = activeKey(key, "forums")}
	<div class="h-full rounded-lg bg-primary/3 p-5">
		<p class="mb-1 text-xs font-bold text-primary/45 uppercase">Community</p>
		<h2 class="mb-5 text-xl font-black capitalize">{selected}</h2>
		<div class="space-y-3">
			{#each ["Regional Cup signups", "Shiny hunt weekend", "Draft league finals"] as event, index (event)}
				<div class="rounded-lg border border-border/60 bg-background p-4">
					<div class="flex items-center justify-between gap-3">
						<p class="text-sm font-black">{event}</p>
						<span class="rounded-full bg-muted px-2 py-1 text-[10px] font-bold">
							{index + 8}:00
						</span>
					</div>
					<p class="mt-1 text-xs text-primary/45">Trainers gathering now</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}
