<script lang="ts">
  interface Props {
    open?: boolean;
    size?: number;
  }

  const { open = false, size = 12 }: Props = $props();
</script>

<svg
  width={size}
  height={size}
  viewBox="0 0 12 12"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  class="chevron"
  class:open
  aria-hidden="true"
>
  <polyline points="3.5 4.5 6 7.5 8.5 4.5" />
</svg>

<style>
  .chevron {
    display: inline-block;
    transition: transform .18s ease;
    transform: rotate(-90deg);
    flex-shrink: 0;
    color: var(--color-text-dim);
  }

  .chevron.open {
    transform: rotate(0deg);
    color: var(--color-text);
  }
</style>
