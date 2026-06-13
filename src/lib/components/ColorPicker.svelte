<script lang="ts">
  import { Tabs } from 'bits-ui';
  import {
    type ColorMode,
    type ColorState,
    normalizeHexInput,
    stateFromCmyk,
    stateFromHex,
    stateFromHsv,
    stateFromRgbChannels,
  } from '../editor/color';

  interface Props {
    value: string | null;
    label?: string;
    disabled?: boolean;
    onchange: (hex: string | null) => void;
  }

  const { value, label = 'Color', disabled = false, onchange }: Props = $props();

  let mode: ColorMode = $state('hex');

  const color = $derived(
    (value ? stateFromHex(value) : stateFromHex('#FFFFFF')) satisfies ColorState,
  );

  const commit = (next: ColorState) => onchange(next.hex);

  const onHexInput = (event: Event) => {
    const normalized = normalizeHexInput((event.target as HTMLInputElement).value);
    if (normalized) {
      commit(stateFromHex(normalized));
    }
  };

  const onNativePick = (event: Event) =>
    commit(stateFromHex((event.target as HTMLInputElement).value.toUpperCase()));

  const onRgb = (channel: 'r' | 'g' | 'b', raw: number) => {
    const next = { ...color.rgb, [channel]: raw };
    commit(stateFromRgbChannels(next.r, next.g, next.b));
  };

  const onHsv = (channel: 'h' | 's' | 'v', raw: number) => {
    const next = { ...color.hsv, [channel]: raw };
    commit(stateFromHsv(next.h, next.s, next.v));
  };

  const onCmyk = (channel: 'c' | 'm' | 'y' | 'k', raw: number) => {
    const next = { ...color.cmyk, [channel]: raw };
    commit(stateFromCmyk(next.c, next.m, next.y, next.k));
  };

  const clear = () => onchange(null);
</script>

<div class="picker" class:disabled>
  <header>
    <span class="label">{label}</span>
    <Tabs.Root
      value={mode}
      onValueChange={(next) => (mode = next as ColorMode)}
      class="modes"
    >
      <Tabs.List class="modes-list">
        {#each ['hex', 'rgb', 'hsv', 'cmyk'] as const as option}
          <Tabs.Trigger value={option} {disabled} class="mode-tab">
            {option.toUpperCase()}
          </Tabs.Trigger>
        {/each}
      </Tabs.List>
    </Tabs.Root>
  </header>

  <div class="row">
    <label class="swatch" style:background-color={color.hex} title={color.hex}>
      <input
        type="color"
        value={color.hex}
        {disabled}
        oninput={onNativePick}
      />
    </label>

    {#if mode === 'hex'}
      <input
        type="text"
        class="hex-input"
        value={color.hex}
        {disabled}
        spellcheck="false"
        autocomplete="off"
        onchange={onHexInput}
      />
    {:else if mode === 'rgb'}
      <div class="channels">
        {#each [
          { key: 'r', max: 255, color: '#dc4644' },
          { key: 'g', max: 255, color: '#5fc25f' },
          { key: 'b', max: 255, color: '#5082f0' },
        ] as channel}
          <label class="channel">
            <span style:color={channel.color}>{channel.key.toUpperCase()}</span>
            <input
              type="range"
              min={0}
              max={channel.max}
              {disabled}
              value={color.rgb[channel.key as 'r' | 'g' | 'b']}
              oninput={(event) => onRgb(channel.key as 'r' | 'g' | 'b', Number(event.currentTarget.value))}
            />
            <span class="readout">{color.rgb[channel.key as 'r' | 'g' | 'b']}</span>
          </label>
        {/each}
      </div>
    {:else if mode === 'hsv'}
      <div class="channels">
        {#each [
          { key: 'h', max: 360, unit: '°' },
          { key: 's', max: 100, unit: '%' },
          { key: 'v', max: 100, unit: '%' },
        ] as channel}
          <label class="channel">
            <span>{channel.key.toUpperCase()}</span>
            <input
              type="range"
              min={0}
              max={channel.max}
              {disabled}
              value={color.hsv[channel.key as 'h' | 's' | 'v']}
              oninput={(event) => onHsv(channel.key as 'h' | 's' | 'v', Number(event.currentTarget.value))}
            />
            <span class="readout">{color.hsv[channel.key as 'h' | 's' | 'v']}{channel.unit}</span>
          </label>
        {/each}
      </div>
    {:else}
      <div class="channels">
        {#each ['c', 'm', 'y', 'k'] as const as channel}
          <label class="channel">
            <span>{channel.toUpperCase()}</span>
            <input
              type="range"
              min={0}
              max={100}
              {disabled}
              value={color.cmyk[channel]}
              oninput={(event) => onCmyk(channel, Number(event.currentTarget.value))}
            />
            <span class="readout">{color.cmyk[channel]}%</span>
          </label>
        {/each}
      </div>
    {/if}
  </div>

  <footer>
    <button type="button" class="clear" {disabled} onclick={clear}>
      {value ? 'Remove' : 'No tint'}
    </button>
  </footer>
</div>

<style>
  .picker {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .picker.disabled {
    opacity: 0.4;
    pointer-events: none;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 6px;
  }

  .label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: var(--text-dim);
    font-weight: 600;
  }

  :global(.modes) {
    flex: none;
  }

  :global(.modes-list) {
    display: flex;
    gap: 2px;
    background: var(--bg);
    border-radius: 6px;
    padding: 2px;
  }

  :global(.mode-tab) {
    background: transparent;
    border: none;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .5px;
    color: var(--text-dim);
    cursor: pointer;
    font-family: inherit;
    min-height: 28px;
  }

  :global(.mode-tab[data-state='active']) {
    background: var(--accent-soft);
    color: var(--accent);
  }

  :global(.mode-tab[data-disabled]) {
    opacity: .5;
    pointer-events: none;
  }

  .row {
    display: flex;
    gap: 10px;
    align-items: stretch;
  }

  .swatch {
    position: relative;
    width: 44px;
    min-height: 44px;
    flex-shrink: 0;
    border-radius: var(--radius);
    border: 1px solid var(--border);
    overflow: hidden;
    cursor: pointer;
  }

  .swatch input {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    background: transparent;
  }

  .hex-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    color: var(--text);
    padding: 8px 10px;
    font-family: var(--font-mono);
    font-size: 13px;
    letter-spacing: 1px;
    text-transform: uppercase;
    min-height: 44px;
  }

  .hex-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  .channels {
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .channel {
    display: grid;
    grid-template-columns: 14px 1fr 42px;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    color: var(--text-dim);
  }

  .channel .readout {
    text-align: right;
    font-variant-numeric: tabular-nums;
    color: var(--text);
  }

  footer {
    display: flex;
    justify-content: flex-end;
  }

  .clear {
    font-size: 11px;
    padding: 6px 10px;
  }
</style>
