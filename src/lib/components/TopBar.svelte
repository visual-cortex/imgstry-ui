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
    {/if}
    {#if editor.isRendering}
      <span class="status">rendering…</span>
    {:else if editor.showOriginal}
      <span class="status warn">showing original</span>
    {/if}
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
    color: var(--color-accent);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 4px;
  }

  .status.warn {
    color: var(--color-warn);
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
      font-size: 11px;
    }
    .module { display: none; }
    .actions :global(button) {
      font-size: 11px;
      padding: 6px 8px;
    }
  }
</style>
