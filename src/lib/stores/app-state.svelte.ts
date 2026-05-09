import { getContext, setContext } from 'svelte';

type Generation =
	| 'generation-i'
	| 'generation-ii'
	| 'generation-iii'
	| 'generation-iv'
	| 'generation-v'
	| 'generation-vi'
	| 'generation-vii'
	| 'generation-viii'
	| 'generation-ix';

type ViewMode = 'list' | 'grid';
type ShinyMode = 'always' | 'never' | 'random';

const KEY = Symbol('APP_STATE');

export class AppState {
	#generation = $state<Generation>('generation-v');
	#viewMode = $state<ViewMode>('grid');
	#shinyMode = $state<ShinyMode>('never');

	get generation() {
		return this.#generation;
	}
	set generation(value: Generation) {
		this.#generation = value;
	}

	get viewMode() {
		return this.#viewMode;
	}
	set viewMode(value: ViewMode) {
		this.#viewMode = value;
	}

	get shinyMode() {
		return this.#shinyMode;
	}
	set shinyMode(value: ShinyMode) {
		this.#shinyMode = value;
	}

	constructor() {
		if (typeof window !== 'undefined') {
			const settings = localStorage.getItem('settings');
			if (settings) {
				try {
					const parsed = JSON.parse(settings);
					if (parsed.generation) this.#generation = parsed.generation;
					if (parsed.viewMode) this.#viewMode = parsed.viewMode;
					if (parsed.shinyMode) this.#shinyMode = parsed.shinyMode;
				} catch (e) {
					console.error('Failed to parse settings from localStorage', e);
				}
			}
		}

		$effect(() => {
			if (typeof window !== 'undefined') {
				const stateToSave = {
					generation: this.generation,
					viewMode: this.viewMode,
					shinyMode: this.shinyMode
				};
				localStorage.setItem('settings', JSON.stringify(stateToSave));
			}
		});

		setContext(KEY, this);
	}

	static get() {
		const state = getContext<AppState>(KEY);
		if (!state) {
			throw new Error(
				'GlobalState was retrieved before it was initialized or outside of the component tree.'
			);
		}
		return state;
	}
}
