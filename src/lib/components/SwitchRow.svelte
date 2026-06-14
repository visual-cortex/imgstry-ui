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
  <span class="switch-wrap">
    <Switch.Root
      checked={checked}
      {disabled}
      onCheckedChange={(value) => onchange(value)}
      class="switch"
    >
      <Switch.Thumb class="thumb" />
    </Switch.Root>
  </span>
</label>

<style>
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 0;
    cursor: pointer;
    color: var(--color-text-dim);
    font-size: 12px;
  }

  .row.disabled {
    opacity: 0.4;
    cursor: default;
  }

  .label {
    color: var(--color-text-dim);
  }

  .switch-wrap {
    display: inline-flex;
  }

  :global(.switch-wrap .switch) {
    position: relative;
    width: 36px;
    height: 20px;
    padding: 0;
    background: var(--color-bg-input);
    border-radius: 999px;
    border: 1px solid var(--color-border);
    cursor: pointer;
    transition: background 0.15s ease, border-color 0.15s ease;
    display: inline-block;
    flex-shrink: 0;
  }

  :global(.switch-wrap .switch[data-state='checked']) {
    background: var(--color-accent);
    border-color: var(--color-accent);
  }

  :global(.switch-wrap .switch[data-disabled]) {
    cursor: default;
  }

  :global(.switch-wrap .thumb) {
    display: block;
    position: absolute;
    top: 2px;
    left: 2px;
    width: 14px;
    height: 14px;
    background: var(--color-text);
    border-radius: 999px;
    transition: left 0.15s ease, background 0.15s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    pointer-events: none;
  }

  :global(.switch-wrap .switch[data-state='checked'] .thumb) {
    left: 17px;
    background: #fff;
  }
</style>
