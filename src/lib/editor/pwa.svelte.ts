/// <reference types="vite-plugin-pwa/client" />
import { registerSW } from 'virtual:pwa-register';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const INSTALL_DISMISSED_KEY = 'imgstry.pwa.install-dismissed';

class PwaState {
  public online = $state(typeof navigator === 'undefined' ? true : navigator.onLine);
  public needsRefresh = $state(false);
  public offlineReady = $state(false);
  public canInstall = $state(false);
  public installDismissed = $state(false);

  private _installEvent: BeforeInstallPromptEvent | null = null;
  private _update: ((reload?: boolean) => Promise<void>) | null = null;

  public constructor() {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      this.installDismissed = localStorage.getItem(INSTALL_DISMISSED_KEY) === '1';
    } catch {
      // Private mode / storage disabled - prompt stays dismissible per-session.
    }

    this._update = registerSW({
      immediate: true,
      onNeedRefresh: () => {
        this.needsRefresh = true;
      },
      onOfflineReady: () => {
        this.offlineReady = true;
      },
    });

    window.addEventListener('online',  () => (this.online = true));
    window.addEventListener('offline', () => (this.online = false));

    window.addEventListener('beforeinstallprompt', (event) => {
      event.preventDefault();
      this._installEvent = event as BeforeInstallPromptEvent;
      this.canInstall = true;
    });

    window.addEventListener('appinstalled', () => {
      this._installEvent = null;
      this.canInstall = false;
    });
  }

  public dismissInstall(): void {
    this.installDismissed = true;
    try {
      localStorage.setItem(INSTALL_DISMISSED_KEY, '1');
    } catch {
      // Best-effort persistence.
    }
  }

  public async install(): Promise<void> {
    if (!this._installEvent) {
      return;
    }
    await this._installEvent.prompt();
    const choice = await this._installEvent.userChoice;
    if (choice.outcome === 'accepted') {
      this._installEvent = null;
      this.canInstall = false;
    }
  }

  public async refresh(): Promise<void> {
    if (this._update) {
      await this._update(true);
    }
  }

  public dismissReady(): void {
    this.offlineReady = false;
  }
}

export const pwa = new PwaState();
