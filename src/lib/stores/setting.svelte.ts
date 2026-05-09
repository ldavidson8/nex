import type { Settings } from '$lib/types';
import { browser } from '$app/environment';

class SettingsState {
	#current = $state<Settings>({ theme: 'System' });

	constructor() {
		if (browser) {
			const stored = localStorage.getItem('settings');
			if (stored) {
				this.#current = JSON.parse(stored);
			}

			$effect.root(() => {
				$effect(() => {
					localStorage.setItem('settings', JSON.stringify(this.#current));
				});
			});
		}
	}

	get theme() {
		return this.#current.theme;
	}
	set theme(value: Settings['theme']) {
		this.#current.theme = value;
	}
}

export const settings = new SettingsState();
