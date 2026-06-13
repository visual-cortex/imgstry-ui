<script lang="ts">
  import { editor } from '../editor/editor.svelte';

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
    <span class="logo">◐</span>
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
      accept="image/*"
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
    background: var(--bg-rail);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .logo {
    color: var(--accent);
    font-size: 16px;
  }

  h1 {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    letter-spacing: 0.6px;
  }

  .module {
    color: var(--text-muted);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 1.5px;
    margin-left: 4px;
  }

  .center {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-self: center;
    color: var(--text-dim);
    font-size: 12px;
  }

  .filename {
    color: var(--text);
  }

  .meta {
    color: var(--text-muted);
    font-family: var(--font-mono);
    font-size: 11px;
  }

  .status {
    color: var(--accent);
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-left: 4px;
  }

  .status.warn {
    color: var(--warn);
  }

  .actions {
    display: flex;
    gap: 6px;
    justify-self: end;
  }
</style>
