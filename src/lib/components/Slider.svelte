<script lang="ts">
  interface Props {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    defaultValue?: number;
    disabled?: boolean;
    suffix?: string;
    bipolar?: boolean;
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
    suffix = '',
    bipolar = true,
    onchange,
  }: Props = $props();

  const fill = $derived.by(() => {
    if (!bipolar) {
      const ratio = (value - min) / (max - min);
      return `linear-gradient(90deg, var(--accent) 0%, var(--accent) ${ratio * 100}%, var(--border) ${ratio * 100}%, var(--border) 100%)`;
    }
    const center = -min / (max - min);
    const current = (value - min) / (max - min);
    const left = Math.min(center, current);
    const right = Math.max(center, current);
    return `linear-gradient(90deg,
      var(--border) 0%,
      var(--border) ${left * 100}%,
      var(--accent) ${left * 100}%,
      var(--accent) ${right * 100}%,
      var(--border) ${right * 100}%,
      var(--border) 100%
    )`;
  });
</script>

<label class="slider" class:disabled>
  <span class="row">
    <span class="name">{label}</span>
    <span class="value" class:active={value !== defaultValue}>{value}{suffix}</span>
  </span>
  <input
    type="range"
    {min}
    {max}
    {step}
    {disabled}
    {value}
    style:background={fill}
    oninput={(event) => onchange(Number(event.currentTarget.value))}
    ondblclick={() => onchange(defaultValue)}
  />
</label>

<style>
  .slider {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  .slider.disabled {
    opacity: 0.4;
  }

  .row {
    display: flex;
    justify-content: space-between;
    font-size: 11px;
  }

  .name {
    color: var(--text-dim);
  }

  .value {
    font-variant-numeric: tabular-nums;
    color: var(--text-muted);
    font-family: var(--font-mono);
  }

  .value.active {
    color: var(--accent);
  }
</style>
