<script lang="ts">
  import { editor } from '../editor/editor.svelte';
  import Logo from './Logo.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  let fileInput: HTMLInputElement;

  const onFile = (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0];

    if (file) {
      void editor.open(file);
    }

    fileInput.value = '';
  };
</script>

<header>
  <div class="brand">
    <Logo size={26} spin={editor.isRendering} />
    <h1>imgstry</h1>
    <span class="module">DEVELOP</span>
  </div>

  <div class="center">
    {#if editor.imageName}
      <span class="filename">{editor.imageName}</span>
      {#if editor.dimensions}
        <span class="meta">·</span>
        <span class="meta">{editor.dimensions.width}×{editor.dimensions.height}</span>
      {/if}
      {#if editor.rawSourceMode === 'sensor'}
        <span
          class="raw-badge sensor"
          title="Editing the 16-bit linear sensor data. Exposure pulls bring back highlight headroom an 8-bit JPEG would have clipped."
        >
          <span class="dot"></span>
          RAW · 14-bit sensor
        </span>
      {:else if editor.rawSourceMode === 'preview'}
        <span
          class="raw-badge preview"
          title="Sensor decode unsupported for this file. Editing the camera's baked JPEG preview - no extra headroom."
        >
          <span class="dot"></span>
          RAW · JPEG preview
        </span>
      {/if}
    {/if}
    <span
      class="status"
      class:warn={editor.showOriginal && !editor.isRendering}
      class:visible={editor.isRendering || editor.showOriginal}
    >{editor.isRendering ? 'rendering…' : editor.showOriginal ? 'showing original' : ''}</span>
  </div>

  <div class="actions">
    <input
      bind:this={fileInput}
      type="file"
      accept="image/*,.cr2,.cr3,.nef,.nrw,.arw,.srf,.sr2,.dng,.orf,.rw2,.pef,.raf,.x3f,.3fr,.crw,.dcr,.erf,.kdc,.mef,.mos,.mrw,.raw"
      hidden
      onchange={onFile}
    />
    <button class="ghost" onclick={() => fileInput.click()}>Open</button>
    <button
      class="ghost"
      disabled={!editor.hasImage}
      onpointerdown={() => editor.previewOriginal(true)}
      onpointerup={() => editor.previewOriginal(false)}
      onpointerleave={() => editor.showOriginal && editor.previewOriginal(false)}
      title="Hold to compare (\)"
    >
      {editor.showOriginal ? 'Original' : 'Compare'}
    </button>
    <button class="ghost" disabled={!editor.hasImage} onclick={() => editor.resetAdjustments()}>
      Reset
    </button>
    <ThemeToggle />
    <button class="primary" disabled={!editor.hasImage} onclick={() => editor.export('image/jpeg')}>
      Export
    </button>
  </div>
</header>

<style>
  header {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    padding: 8px 14px;
    background: var(--color-bg-rail);
    border-bottom: 1px solid var(--color-border);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h1 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
    line-height: 1;
  }

  .module {
    color: var(--color-text-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    line-height: 1;
    margin-left: 4px;
  }

  .center {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-self: center;
    color: var(--color-text-dim);
    font-size: 12px;
  }

  .filename {
    color: var(--color-text);
  }

  .meta {
    color: var(--color-text-muted);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .status {
    /* Fixed-width slot sized to the widest label ('showing original').
       The text content toggles between empty / 'rendering…' / 'showing
       original'; reserving the slot keeps the centered group from
       reflowing (and shoving the filename around) on every render tick. */
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: 9.5rem;
    color: var(--color-accent);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .status.visible {
    opacity: 1;
  }

  .status.warn {
    color: var(--color-warn);
  }

  .raw-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 3px 10px;
    margin-left: 6px;
    border-radius: var(--radius-pill);
    border: 1px solid transparent;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .8px;
    text-transform: uppercase;
    white-space: nowrap;
    flex: none;
    cursor: help;
  }

  .raw-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 6px currentColor;
  }

  .raw-badge.sensor {
    color: var(--color-ok);
    background: color-mix(in srgb, var(--color-ok) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-ok) 35%, transparent);
  }

  .raw-badge.preview {
    color: var(--color-warn);
    background: color-mix(in srgb, var(--color-warn) 12%, transparent);
    border-color: color-mix(in srgb, var(--color-warn) 35%, transparent);
  }

  @media (max-width: 700px) {
    .raw-badge {
      font-size: 9px;
      padding: 2px 7px;
    }
  }

  .actions {
    display: flex;
    gap: 6px;
    justify-self: end;
  }

  .actions :global(button) {
    min-height: 36px;
  }

  @media (max-width: 700px) {
    header {
      grid-template-columns: auto 1fr;
      grid-template-areas:
        'brand actions'
        'center center';
      padding: 8px 10px;
      gap: 4px;
    }

    .brand { grid-area: brand; }
    .actions { grid-area: actions; }
    .center {
      grid-area: center;
      justify-self: start;
      min-width: 0;
      overflow: hidden;
      font-size: 11px;
    }
    .filename {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /* On mobile the centre row is left-aligned, so the status can't shove
       the filename - drop the desktop fixed-width reservation and let it
       size to content instead of stealing room from the RAW chip. */
    .status { width: auto; }
    .module { display: none; }
    .actions :global(button) {
      font-size: 11px;
      padding: 6px 8px;
    }
  }
</style>
