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
    <h1>imgstry studio</h1>
    {#if editor.imageName}
      <span class="filename">{editor.imageName}</span>
    {/if}
    {#if editor.isRendering}
      <span class="rendering">rendering…</span>
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
    <button onclick={() => fileInput.click()}>Open</button>
    <button
      disabled={!editor.hasImage}
      onpointerdown={() => editor.previewOriginal(true)}
      onpointerup={() => editor.previewOriginal(false)}
      onpointerleave={() => editor.showOriginal && editor.previewOriginal(false)}
    >
      {editor.showOriginal ? 'Original' : 'Compare'}
    </button>
    <button disabled={!editor.hasImage} onclick={() => editor.resetAdjustments()}>
      Reset
    </button>
    <button disabled={!editor.hasImage} onclick={() => editor.export('image/png')}>
      PNG
    </button>
    <button disabled={!editor.hasImage} onclick={() => editor.export('image/jpeg')}>
      JPEG
    </button>
  </div>
</header>

<style>
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    background: var(--bg-panel);
    border-bottom: 1px solid var(--border);
  }

  .brand {
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .logo {
    color: var(--accent);
    font-size: 18px;
  }

  h1 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.4px;
  }

  .filename {
    color: var(--text-dim);
    font-size: 12px;
  }

  .rendering {
    color: var(--accent);
    font-size: 12px;
  }

  .actions {
    display: flex;
    gap: 8px;
  }
</style>
