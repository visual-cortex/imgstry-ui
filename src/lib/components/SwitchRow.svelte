<script lang="ts">
  import { Switch } from 'bits-ui';

  interface Props {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onchange: (value: boolean) => void;
  }

  const { label, checked, disabled = false, onchange }: Props = $props();
</script>

<label class="row" class:disabled>
  <span class="label">{label}</span>
  <Switch.Root
    checked={checked}
    {disabled}
    onCheckedChange={(value) => onchange(value)}
    class="switch"
  >
    <Switch.Thumb class="thumb" />
  </Switch.Root>
</label>

<style>
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    cursor: pointer;
    color: var(--text-dim);
    font-size: 12px;
  }

  .row.disabled {
    opacity: 0.4;
    cursor: default;
  }

  .label {
    color: var(--text-dim);
  }

  :global(.switch) {
    position: relative;
    width: 36px;
    height: 20px;
    background: var(--bg-input);
    border-radius: 999px;
    border: 1px solid var(--border);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
  }

  :global(.switch[data-state='checked']) {
    background: var(--accent);
    border-color: var(--accent);
  }

  :global(.switch[data-disabled]) {
    cursor: default;
  }

  :global(.thumb) {
    display: block;
    width: 14px;
    height: 14px;
    background: var(--text);
    border-radius: 999px;
    transform: translate3d(2px, 2px, 0);
    transition: transform 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  :global(.switch[data-state='checked'] .thumb) {
    transform: translate3d(17px, 2px, 0);
    background: white;
  }
</style>
