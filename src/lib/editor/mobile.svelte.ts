export type MobilePane = 'adjust' | 'curve' | 'presets' | 'history';

class MobileState {
  public open = $state(false);
  public activePane = $state<MobilePane>('adjust');
}

export const mobile = new MobileState();
