<script lang="ts">
	import DesktopNav from '$lib/components/DesktopNav.svelte';
	import MobileNav from '$lib/components/MobileNav.svelte';
	import { Button } from '$lib/components/ui/button';
	import SettingsOverlay from './SettingsOverlay.svelte';

	import * as Popover from '$lib/components/ui/popover';
	import { Search, Settings2 } from '@lucide/svelte';
</script>

<nav class="border-border bg-background relative z-50 border-b">
	<div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
		<div class="flex items-center gap-6">
			<MobileNav class="-ml-2 lg:hidden" />
			<a href="/" class="text-foreground mr-4 text-lg font-bold tracking-tight">Nex</a>
			<DesktopNav class="hidden lg:block" />
		</div>
		<div class="flex items-center space-x-4">
			<div class="hidden lg:block">
				<Popover.Root>
					<Popover.Trigger>
						{#snippet child({ props })}
							<Button variant="ghost" size="icon" {...props}>
								<Settings2 class="size-4" />
							</Button>
						{/snippet}
					</Popover.Trigger>
					<Popover.Content class="w-80">
						<SettingsOverlay />
					</Popover.Content>
				</Popover.Root>
			</div>
			<Button variant="ghost">
				<Search class="size-4" />
			</Button>
		</div>
	</div>
</nav>
