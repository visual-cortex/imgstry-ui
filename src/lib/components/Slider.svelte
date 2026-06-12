<script lang="ts">
  interface Props {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    defaultValue?: number;
    disabled?: boolean;
    onchange: (value: number) => void;
  }

  let {
    label,
    min,
    max,
    step = 1,
    value,
    defaultValue = 0,
    disabled = false,
    onchange,
  }: Props = $props();
</script>

<label class="slider" class:disabled>
  <span class="row">
    <span class="name">{label}</span>
    <span class="value" class:active={value !== defaultValue}>{value}</span>
  </span>
  <input
    type="range"
    {min}
    {max}
    {step}
    {disabled}
    {value}
    oninput={(event) => onchange(Number(event.currentTarget.value))}
    ondblclick={() => onchange(defaultValue)}
  />
</label>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .slider.disabled {
    opacity: 0.4;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
  }

  .name {
    color: var(--text-dim);
  }

  .value {
    font-variant-numeric: tabular-nums;
    color: var(--text-dim);
  }

  .value.active {
    color: var(--accent);
  }
</style>
