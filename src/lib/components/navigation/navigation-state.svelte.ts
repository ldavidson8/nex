import { SvelteMap } from "svelte/reactivity";

export const NAVIGATION_CONTEXT_KEY = Symbol("navigation-state");

export class NavigationState {
	activeTriggerId = $state<string | null>(null);
	previousTriggerId = $state<string | null>(null);
	activatedOnce = $state(false);
	hoveredItemKey = $state<string | null>(null);
	triggerOffsets = new SvelteMap<string, number>();
	contentPreviews = new SvelteMap<string, boolean>();
	contentHeights = new SvelteMap<string, number>();
	private closeTimer: ReturnType<typeof setTimeout> | null = null;

	activeHasPreview = $derived(
		this.activeTriggerId ? (this.contentPreviews.get(this.activeTriggerId) ?? false) : false,
	);

	activeHeight = $derived(
		this.activeTriggerId ? (this.contentHeights.get(this.activeTriggerId) ?? 0) : 0,
	);

	open = (id: string) => {
		this.cancelClose();
		this.previousTriggerId = this.activeTriggerId;
		this.activatedOnce = true;
		this.activeTriggerId = id;
		this.hoveredItemKey = null;
	};

	close = () => {
		this.cancelClose();
		this.previousTriggerId = null;
		this.activeTriggerId = null;
		this.hoveredItemKey = null;
	};

	scheduleClose = () => {
		this.cancelClose();
		this.closeTimer = setTimeout(() => {
			this.previousTriggerId = null;
			this.activeTriggerId = null;
			this.hoveredItemKey = null;
		}, 120);
	};

	cancelClose = () => {
		if (!this.closeTimer) return;
		clearTimeout(this.closeTimer);
		this.closeTimer = null;
	};

	registerTrigger = (id: string, offsetLeft: number) => {
		this.triggerOffsets.set(id, offsetLeft);
	};

	registerContent = (id: string, hasPreview: boolean) => {
		this.contentPreviews.set(id, hasPreview);
	};

	registerContentHeight = (id: string, height: number) => {
		this.contentHeights.set(id, height);
	};

	setHoveredItem = (key: string) => {
		this.hoveredItemKey = key;
	};
}
