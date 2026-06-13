export type ThemeMode = 'dark' | 'light';

const STORAGE_KEY = 'imgstry-ui:theme';

const initialMode = (): ThemeMode => {
  if (typeof window === 'undefined') {
    return 'dark';
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') {
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

class ThemeState {
  public mode = $state<ThemeMode>(initialMode());

  public constructor() {
    if (typeof document !== 'undefined') {
      $effect.root(() => {
        $effect(() => {
          document.documentElement.dataset.theme = this.mode;
          window.localStorage.setItem(STORAGE_KEY, this.mode);
        });
      });
    }
  }

  public toggle(): void {
    this.mode = this.mode === 'dark' ? 'light' : 'dark';
  }
}

export const theme = new ThemeState();
